-- fonction qui insère un utilisateur dans la table user
CREATE OR REPLACE FUNCTION web.get_all_users() RETURNS SETOF main.user AS $$
	SELECT *
	FROM main.user;

$$ LANGUAGE sql SECURITY DEFINER;


-- fonction qui recupere les infos d'un user
CREATE OR REPLACE FUNCTION web.get_one_user(user_id int) RETURNS main.user AS $$
	SELECT * FROM main.user WHERE main.user.id = user_id;

$$ LANGUAGE sql;

-- fonction qui insère un utilisateur dans la table user
CREATE OR REPLACE FUNCTION web.insert_user(u json) RETURNS main.user AS $$
	INSERT INTO main.user
	(nickname, firstname, lastname, device, picture, role)
	VALUES
	(
		u->>'nickname',
        u->>'firstname',
        u->>'lastname',
        u->>'device',
        u->>'picture',
        u->>'role'
	)
	-- je retourne la ligne insérée
	RETURNING *;

$$ LANGUAGE sql SECURITY DEFINER;

-- fonction qui supprime une catégorie
CREATE OR REPLACE FUNCTION web.delete_user(user_id int) RETURNS boolean AS $$
	DECLARE id_selected int;
	BEGIN
		SELECT id INTO id_selected
		FROM main.user
		WHERE id = user_id;
	IF FOUND THEN
		DELETE FROM main.user
		WHERE id = user_id;
		RETURN true;
	ELSE
		RETURN false;
	END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS main.user AS $$
DECLARE
    user_db main.user;
BEGIN
    
    SELECT id, nickname, firstname, lastname, picture
    INTO user_db
    FROM main.user WHERE id=(u->>'id')::int;
	
	IF NOT FOUND THEN
        -- Handle the case where the user record does not exist
        RAISE EXCEPTION 'User with ID % not found', (u->>'id')::int;
    END IF;

    IF u->>'nickname' IS NOT NULL
    THEN 
    user_db.nickname = u->>'nickname';
    END IF;

    IF u->>'firstname' IS NOT NULL
    THEN 
    user_db.firstname = u->>'firstname';
    END IF;

    IF u->>'lastname' IS NOT NULL
    THEN 
    user_db.lastname = u->>'lastname';
    END IF;

    IF u->>'picture' IS NOT NULL
    THEN 
    user_db.picture = u->>'picture';
    END IF;

    UPDATE main.user
    SET nickname = user_db.nickname, firstname = user_db.firstname, lastname = user_db.lastname, picture = user_db.picture
    WHERE id = (u->> 'id')::int;

    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION web.get_all_friends(param_user_id int)
RETURNS TABLE (contact_id int, friend_id int, friend_nickname text, friend_firstname text, friend_lastname text, friend_picture text)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS contact_id,
        f.id AS friend_id,
        f.nickname AS friend_nickname,
        f.firstname AS friend_firstname,
        f.lastname AS friend_lastname,
        f.picture AS friend_picture
    FROM
        web.contact c
    INNER JOIN
        main.user f ON c.friend_id = f.id
    WHERE
        c.user_id = param_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.get_one_friend(param_user_id int, param_friend_id int)
RETURNS TABLE (contact_id int, friend_id int, friend_nickname text, friend_firstname text, friend_lastname text, friend_picture text)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS contact_id,
        f.id AS friend_id,
        f.nickname AS friend_nickname,
        f.firstname AS friend_firstname,
        f.lastname AS friend_lastname,
        f.picture AS friend_picture
    FROM
        web.contact c
    INNER JOIN
        main.user f ON c.friend_id = f.id
    WHERE
        c.user_id = param_user_id
        AND f.id = param_friend_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.add_friend_to_user(param_user_id int, param_friend_id int)
RETURNS text
AS $$
DECLARE
    friendship_exists BOOLEAN;
BEGIN
    friendship_exists := false;
    BEGIN
        SELECT EXISTS (
            SELECT 1
            FROM web.contact c
            WHERE c.user_id = param_user_id AND c.friend_id = param_friend_id
        ) INTO friendship_exists;
    EXCEPTION
        WHEN others THEN
            friendship_exists := false;
    END;
    IF friendship_exists THEN
        RETURN 'Friendship already exists';
    END IF;
    INSERT INTO web.contact (user_id, friend_id)
    VALUES (param_user_id, param_friend_id);
    RETURN 'Friend added successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.delete_friend_from_user(param_user_id int, param_friend_id int)
RETURNS text
AS $$
BEGIN
    -- Check if the friendship exists
    IF EXISTS (
        SELECT 1
        FROM web.contact c
        WHERE c.user_id = param_user_id AND c.friend_id = param_friend_id
    ) THEN
        -- Delete the friendship
        DELETE FROM web.contact
        WHERE user_id = param_user_id AND friend_id = param_friend_id;

        -- You can add additional logic here if needed

        -- Return success message or other information
        RETURN 'Friendship deleted successfully';
    ELSE
        -- If friendship does not exist, return a message
        RETURN 'Friendship does not exist';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.get_user_crews_with_users(param_user_id int)
RETURNS TABLE (
    crew_id int,
    crew_name text,
    crew_picture text,
    users_in_crew jsonb
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS crew_id,
        c.name AS crew_name,
        c.picture AS crew_picture,
        (
            SELECT 
                jsonb_agg(
                    jsonb_build_object(
                        'user_id', u.id,
                        'user_nickname', u.nickname,
                        'user_firstname', u.firstname,
                        'user_lastname', u.lastname,
                        'user_picture', u.picture
                    )
                )
            FROM
                web.r_user_crew uc_inner
            INNER JOIN
                main.user u ON uc_inner.user_id = u.id
            WHERE
                uc_inner.crew_id = c.id
        ) AS users_in_crew
    FROM
        web.r_user_crew uc
    INNER JOIN
        web.crew c ON uc.crew_id = c.id
    WHERE
        uc.user_id = param_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.get_user_one_crew(param_user_id int, param_crew_id int)
RETURNS TABLE (
    crew_id int,
    crew_name text,
    crew_picture text,
    invited_users jsonb[]
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS crew_id,
        c.name AS crew_name,
        c.picture AS crew_picture,
        ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture
            )
            FROM web.r_user_crew rc
            JOIN main.user u ON rc.user_id = u.id
            WHERE rc.crew_id = c.id
        ) AS invited_users
    FROM
        web.r_user_crew rc
    JOIN
        web.crew c ON rc.crew_id = c.id
    WHERE
        rc.user_id = param_user_id
        AND c.id = param_crew_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION web.create_crew_for_users(
    param_user_id int,
    param_crew_name text,
    param_crew_picture text,
    param_user_ids int[]
)
RETURNS TABLE (
    crew_id int,
    crew_name text,
    crew_picture text
)
AS $$
DECLARE
    new_crew_id int;
BEGIN
    -- Insert new crew
    INSERT INTO web.crew (name, picture, user_id)
    VALUES (param_crew_name, param_crew_picture, param_user_id)
    RETURNING id INTO new_crew_id;

    -- Create temporary table to store user IDs
    CREATE TEMPORARY TABLE temp_user_ids (user_id int);
    
    -- Insert user IDs into temporary table
    INSERT INTO temp_user_ids (user_id)
    SELECT unnest(param_user_ids);

    -- Link users to the new crew
    INSERT INTO web.r_user_crew (user_id, crew_id)
    SELECT user_id, new_crew_id FROM temp_user_ids;

    -- Return details of the created crew
    RETURN QUERY
    SELECT
        new_crew_id,
        param_crew_name,
        param_crew_picture;

    -- Drop the temporary table
    DROP TABLE temp_user_ids;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.delete_crew_and_links(crew_id_param int)
RETURNS TEXT
AS $$
DECLARE
    result_text TEXT;
BEGIN
    -- Attempt to delete links from r_user_crew
    DELETE FROM web.r_user_crew WHERE crew_id = crew_id_param;
    
    -- Check if any rows were deleted
    IF FOUND THEN
        -- Delete the crew
        DELETE FROM web.crew WHERE id = crew_id_param;
        result_text := "Crew and links deleted successfully.";
    ELSE
        result_text := "Crew not found or no links to delete.";
    END IF;

    RETURN result_text;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.get_user_events_with_invitations(user_id_param int)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time, -- Use the actual column name from your table
    place text,
    nb_people smallint,
    invited_users jsonb[]
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time, -- Use the actual column name from your table
        e.place,
        e.nb_people,
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
        e.owner = user_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.get_user_event_with_invitations(user_id_param int, event_id_param int)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time, -- Use the actual column name from your table
    place text,
    nb_people smallint,
    invited_users jsonb[]
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time, -- Use the actual column name from your table
        e.place,
        e.nb_people,
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
        e.owner = user_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.create_event_for_users(
    param_user_id int,
    param_theme text,
    param_date date,
    param_time time,
    param_place text,
    param_nb_people smallint,
    param_invited_user_ids int[],
    param_invited_crew_ids int[]
)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    nb_people smallint,
    invited_users jsonb[]
)
AS $$
DECLARE
    new_event_id int;
    invited_user_id int;
BEGIN
    -- Insert new event
    INSERT INTO web.event (theme, date, time, place, nb_people, owner)
    VALUES (param_theme, param_date, param_time, param_place, param_nb_people, param_user_id)
    RETURNING id INTO new_event_id;

    -- Create temporary table to store user IDs
    CREATE TEMPORARY TABLE temp_user_ids (user_id int);
    
    -- Insert user IDs into temporary table
    INSERT INTO temp_user_ids (user_id)
    SELECT unnest(param_invited_user_ids);

    -- Link users to the new event, checking if they are already invited
    INSERT INTO web.r_user_event (user_id, event_id, userstate)
    SELECT
        t.user_id,
        new_event_id,
        true
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
        true
    FROM
        web.r_user_crew uc
    WHERE
        uc.crew_id = ANY(param_invited_crew_ids)
        AND NOT EXISTS (
            SELECT 1
            FROM web.r_user_event re
            WHERE re.user_id = uc.user_id AND re.event_id = new_event_id
        );

    -- Return details of the created event
    RETURN QUERY
    SELECT
        new_event_id,
        param_theme,
        param_date,
        param_time,
        param_place,
        param_nb_people,
        ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture
            )
            FROM main.user u
            WHERE u.id = ANY(param_invited_user_ids)
        ) || ARRAY(
            SELECT jsonb_build_object(
                'user_id', u.id,
                'nickname', u.nickname,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'picture', u.picture
            )
            FROM main.user u
            JOIN web.r_user_crew uc ON u.id = uc.user_id
            WHERE uc.crew_id = ANY(param_invited_crew_ids)
        ) AS invited_users;

    -- Drop the temporary table
    DROP TABLE temp_user_ids;
END;
$$ LANGUAGE plpgsql;

-- ! EDIT

CREATE OR REPLACE FUNCTION web.edit_user_event(u json)
RETURNS TABLE (
    event_id int,
    theme text,
    date date,
    event_time time,
    place text,
    nb_people smallint,
    invited_users jsonb[]
)
AS $$
DECLARE
    param_event_id int;
    param_theme text;
    param_date date;
    param_time time;
    param_place text;
    param_nb_people smallint;
BEGIN
    -- Extract values from JSON parameter
    param_event_id := (u->>'eventId')::int;
    param_theme := u->>'theme';
    param_date := (u->>'date')::date;
    param_time := (u->>'time')::time;
    param_place := u->>'place';
    param_nb_people := (u->>'nb_people')::smallint;

    -- Update the event in the event table and return the updated values
    UPDATE web.event e
    SET
        theme = COALESCE(param_theme, e.theme),
        date = COALESCE(param_date, e.date),
        time = COALESCE(param_time, e.time),
        place = COALESCE(param_place, e.place),
        nb_people = COALESCE(param_nb_people, e.nb_people)
    WHERE
        e.id = param_event_id
    RETURNING
        e.id AS event_id,
        e.theme,
        e.date,
        e.time AS event_time,
        e.place,
        e.nb_people
    INTO
        event_id,
        theme,
        date,
        event_time,
        place,
        nb_people;

    -- Check if there was a matching row in the UPDATE
    IF NOT FOUND THEN
        -- If no matching row, return the old values
        SELECT
            e.id AS event_id,
            e.theme,
            e.date,
            e.time AS event_time,
            e.place,
            e.nb_people
        INTO
            event_id,
            theme,
            date,
            event_time,
            place,
            nb_people
        FROM
            web.event e
        WHERE
            e.id = param_event_id;
    END IF;

    -- Update related entries in the r_user_event table if relevant parameters are provided
    IF param_theme IS NOT NULL OR param_date IS NOT NULL OR param_time IS NOT NULL OR param_place IS NOT NULL OR param_nb_people IS NOT NULL THEN
        UPDATE web.r_user_event re
        SET
            userstate = COALESCE(userstate, re.userstate)
        WHERE
            re.event_id = param_event_id;
    END IF;

    -- Return the invited users
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
            main.user u ON re.user_id = u.id
        WHERE
            re.event_id = param_event_id
    );

    -- Return the updated event along with invited users
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION web.delete_event_by_id(event_id_param int)
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
