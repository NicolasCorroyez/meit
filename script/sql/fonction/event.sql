-- ! EVENT FUNCTIONS
-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos de tous les events d'un utilisateur
CREATE OR REPLACE FUNCTION web.get_user_all_events(param_user_id INT)
RETURNS TABLE (
    event_id INT,
    theme TEXT,
    date DATE,
    event_time TIME,
    place TEXT,
    picture TEXT,
    owner_id INT,
    invited_users JSONB[]
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time,
        e.place,
        e.picture,
        e.owner AS owner_id,
        ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture,
                'userstate', re.userstate
            )
            FROM web.r_user_event re
            JOIN main.user u ON re.user_id = u.id
            WHERE re.event_id = e.id
        ) AS invited_users
    FROM
        web.r_user_event AS wre
    JOIN
        web.event AS e ON wre.event_id = e.id
    WHERE
        wre.user_id = param_user_id;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos d'un event d'un utilisateur
CREATE OR REPLACE FUNCTION web.get_user_one_event(param_user_id int, event_id_param int)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    picture text,
    owner int,
    invited_users jsonb[]
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time,
        e.place,
        e.picture,
        e.owner,
        ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture
            )
            FROM web.r_user_event re
            JOIN main.user u ON re.user_id = u.id
            WHERE re.event_id = e.id
        ) AS invited_users
    FROM
        web.event e
    WHERE
        e.id = event_id_param AND
        (e.owner = param_user_id OR
        EXISTS (
            SELECT 1
            FROM web.r_user_event re
            WHERE re.event_id = e.id AND re.user_id = param_user_id
        ));
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui insere un event d'un utilisateur
CREATE OR REPLACE FUNCTION web.insert_user_event(
    param_user_id int,
    param_theme text,
    param_date date,
    param_time time,
    param_place text,
    param_picture text,
    param_invited_user_ids int[],
    param_invited_crew_ids int[]
)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    picture text,
    invited_users jsonb[]
)
AS $$
DECLARE
    new_event_id int;
    invited_user_id int;
    is_owner_in_crew boolean;  -- Flag to indicate if the owner is in any of the crews
BEGIN
    -- Insert new event
    INSERT INTO web.event (theme, date, time, place, picture, owner)
    VALUES (param_theme, param_date, param_time, param_place, param_picture, param_user_id)
    RETURNING id INTO new_event_id;

    -- Create temporary table to store user IDs
    CREATE TEMPORARY TABLE temp_user_ids (user_id int);
    
    -- Insert user IDs into temporary table
    INSERT INTO temp_user_ids (user_id)
    SELECT unnest(param_invited_user_ids);

    -- Check if the owner is in any of the crews
    SELECT EXISTS (
        SELECT 1
        FROM web.r_user_crew uc
        WHERE uc.user_id = param_user_id AND uc.crew_id = ANY(param_invited_crew_ids)
    ) INTO is_owner_in_crew;

    -- Link users to the new event, checking if they are already invited
    INSERT INTO web.r_user_event (user_id, event_id, userstate)
    SELECT
        t.user_id,
        new_event_id,
        CASE
            WHEN t.user_id = param_user_id AND is_owner_in_crew THEN true  -- Owner is in the crew
            WHEN t.user_id = param_user_id THEN false  -- Owner is not in the crew
            ELSE false  -- Others get userstate = false
        END
    FROM
        temp_user_ids t
    WHERE
        NOT EXISTS (
            SELECT 1
            FROM web.r_user_event re
            WHERE re.user_id = t.user_id AND re.event_id = new_event_id
        );

    -- Invite users from specified crews, checking if they are already invited
    INSERT INTO web.r_user_event (user_id, event_id, userstate)
    SELECT
        uc.user_id,
        new_event_id,
        false  -- Crew members get userstate = false
    FROM
        web.r_user_crew uc
    WHERE
        uc.crew_id = ANY(param_invited_crew_ids)
        AND NOT EXISTS (
            SELECT 1
            FROM web.r_user_event re
            WHERE re.user_id = uc.user_id AND re.event_id = new_event_id
        );

    -- Update userstate for the owner of the event to true
    UPDATE web.r_user_event rue
    SET userstate = true
    WHERE rue.user_id = param_user_id AND rue.event_id = new_event_id;

    -- Return details of the created event
    RETURN QUERY
    SELECT
        new_event_id,
        param_theme,
        param_date,
        param_time,
        param_place,
        param_picture,
        ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture,
                'userstate', CASE WHEN u.id = param_user_id THEN true ELSE false END
            )
            FROM main.user u
            WHERE u.id = ANY(param_invited_user_ids)
        ) || ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture,
                'userstate', false  -- Crew members get userstate = false
            )
            FROM main.user u
            JOIN web.r_user_crew uc ON u.id = uc.user_id
            WHERE uc.crew_id = ANY(param_invited_crew_ids)
        ) AS invited_users;

    -- Drop the temporary table
    DROP TABLE temp_user_ids;
END;
$$ LANGUAGE plpgsql;



-------------------------------------------------------------------------------------------------- !
-- fonction qui modifie l'event d'un utilisateur
CREATE OR REPLACE FUNCTION web.update_user_event(u json)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    picture text,
    invited_users jsonb[]
)
AS $$
DECLARE
    param_event_id int;
    param_theme text;
    param_date date;
    param_time time;
    param_place text;
    param_picture text;
    param_user_ids int[];
BEGIN
    -- Extract values from JSON parameter
    param_event_id := (u->>'eventId')::int;
    param_theme := u->>'theme';
    param_date := (u->>'date')::date;
    param_time := (u->>'time')::time;
    param_place := u->>'place';
    param_picture := (u->>'picture');
    param_user_ids := ARRAY(SELECT json_array_elements_text(u->'userIds')::int);

    -- Update the event in the event table and return the updated values
    UPDATE web.event e
    SET
        theme = COALESCE(param_theme, e.theme),
        date = COALESCE(param_date, e.date),
        time = COALESCE(param_time, e.time),
        place = COALESCE(param_place, e.place),
        picture = COALESCE(param_picture, e.picture)
    WHERE
        e.id = param_event_id
    RETURNING
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time,
        e.place,
        e.picture
    INTO
        event_id,
        theme,
        date,
        event_time,
        place,
        picture;

    -- Check if there was a matching row in the UPDATE
    IF NOT FOUND THEN
        -- If no matching row, return the old values
        SELECT
            e.id AS event_id,
            e.theme,
            e.date,
            e.time AS event_time,
            e.place,
            e.picture
        INTO
            event_id,
            theme,
            date,
            event_time,
            place,
            picture
        FROM
            web.event e
        WHERE
            e.id = param_event_id;
    END IF;

    -- Update related entries in the r_user_event table if relevant parameters are provided
    IF param_user_ids IS NOT NULL AND array_length(param_user_ids, 1) > 0 THEN
    -- Delete existing entries for the given event only if new user IDs are provided
    DELETE FROM web.r_user_event WHERE web.r_user_event.event_id = param_event_id;

    -- Insert new entries for the given user IDs
    INSERT INTO web.r_user_event (user_id, event_id, userstate)
    SELECT user_id, param_event_id, true
    FROM unnest(param_user_ids) AS user_id;
END IF;

    -- Return the invited users only if param_user_ids is provided
    IF param_user_ids IS NOT NULL THEN
        invited_users := ARRAY(
            SELECT
                jsonb_build_object(
                    'user_id', u.id,
                    'nickname', u.nickname,
                    'firstname', u.firstname,
                    'lastname', u.lastname,
                    'picture', u.picture
                )
            FROM
                web.r_user_event re
            JOIN
                main."user" u ON re.user_id = u.id
            WHERE
                re.event_id = param_event_id
        );
    END IF;

    -- Return the updated event along with invited users
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui supprime un événement d'un utilisateur
CREATE OR REPLACE FUNCTION web.delete_user_event(event_id_param int)
RETURNS BOOLEAN
AS $$
DECLARE
    event_deleted BOOLEAN := FALSE;
BEGIN
    -- Delete entries in the r_user_event table associated with the event
    DELETE FROM web.r_user_event
    WHERE event_id = event_id_param;

    -- Delete the event from the main event table
    DELETE FROM web.event
    WHERE id = event_id_param;

    -- Check if any rows were affected in the event table
    GET DIAGNOSTICS event_deleted = ROW_COUNT;

    RETURN event_deleted;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction pour confirmer la présence
CREATE OR REPLACE FUNCTION web.confirm_participation(
    param_user_id int,
    param_event_id int,
    param_new_userstate boolean
)
RETURNS TABLE (
    event_id int,
    user_id int,
    new_userstate boolean
)
AS $$
BEGIN
    -- Update userstate for the specified user in the given event
    UPDATE web.r_user_event rue
    SET userstate = param_new_userstate
    WHERE rue.user_id = param_user_id AND rue.event_id = param_event_id;

    -- Return details of the updated event
    RETURN QUERY
    SELECT
        re.event_id,
        re.user_id,
        re.userstate
    FROM
        web.r_user_event re
    WHERE
        re.user_id = param_user_id AND re.event_id = param_event_id;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------------------------!
CREATE OR REPLACE FUNCTION web.get_unconfirmed_events(param_user_id int)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    picture text,
    owner int
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time,
        e.place,
        e.picture,
        e.owner
    FROM
        web.r_user_event re
    JOIN
        web.event e ON re.event_id = e.id
    WHERE
        re.user_id = param_user_id
        AND re.userstate = false;
END;
$$ LANGUAGE plpgsql;
