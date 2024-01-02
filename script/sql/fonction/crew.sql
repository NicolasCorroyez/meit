-- ! CREW FUNCTIONS
-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos de tous les crews d'un utilisateur
CREATE OR REPLACE FUNCTION web.get_user_all_crews(param_user_id int)
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

-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos d'un crew d'un utilisateur
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
                'user_nickname', u.nickname,
                'user_firstname', u.firstname,
                'user_lastname', u.lastname,
                'user_picture', u.picture
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

-------------------------------------------------------------------------------------------------- !
-- fonction qui insère les infos d'un équipage à un utilisateur et retourne les détails de l'équipage et des utilisateurs associés
CREATE OR REPLACE FUNCTION web.insert_user_crew(
    param_user_id int,
    param_crew_name text,
    param_crew_picture text,
    param_user_ids int[]
)
RETURNS TABLE (
    crew_id int,
    crew_name text,
    crew_picture text,
    users jsonb[]
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
    SELECT tui.user_id, new_crew_id
    FROM temp_user_ids tui;

    -- Return details of the created crew and associated users as an array
    RETURN QUERY
    SELECT
        new_crew_id,
        param_crew_name,
        param_crew_picture,
        ARRAY(
            SELECT
                jsonb_build_object(
                    'user_id', u.id,
                    'user_nickname', u.nickname,
                    'user_firstname', u.firstname,
                    'user_lastname', u.lastname,
                    'user_picture', u.picture
                )
            FROM main.user u
            JOIN web.r_user_crew ruc ON u.id = ruc.user_id
            WHERE ruc.crew_id = new_crew_id
        ) AS users;

    -- Drop the temporary table
    DROP TABLE temp_user_ids;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui modifie les infos d'un crew d'un utilisateur
CREATE OR REPLACE FUNCTION web.update_user_crew(u json)
RETURNS TABLE (
    crew_id int,
    name text,
    picture text,
    user_id int,
    members jsonb[]
)
AS $$
DECLARE
    param_crew_id int;
    param_name text;
    param_owner int;
    param_picture text;
    param_members int[];
BEGIN
    -- Extract values from JSON parameter
    param_crew_id := (u->>'crewId')::int;
    param_name := u->>'name';
    param_picture := u->>'picture';
    param_owner := u->>'user_id';
    param_members := ARRAY(SELECT json_array_elements_text(u->'membersId')::int);

    -- Update the crew in the crew table and return the updated values
    UPDATE web.crew c
    SET
        name = COALESCE(param_name, c.name),
        user_id = COALESCE(param_owner, c.user_id),
        picture = COALESCE(param_picture, c.picture)
    WHERE
        c.id = param_crew_id
    RETURNING
        c.id AS crew_id,
        c.name,
        c.user_id,
        c.picture
    INTO
        crew_id,
        name,
        user_id,
        picture;

    -- Check if there was a matching row in the UPDATE
    IF NOT FOUND THEN
        -- If no matching row, return the old values
        SELECT
            c.id AS crew_id,
            c.name,
            c.user_id,
            c.picture
        INTO
            crew_id,
            name,
            user_id,
            picture
        FROM
            web.crew c
        WHERE
            c.id = param_crew_id;
    END IF;

    -- Update related entries in the r_user_crew table if relevant parameters are provided
    IF param_members IS NOT NULL AND array_length(param_members, 1) > 0 THEN
        -- Delete existing entries for the given crew only if new user IDs are provided
        DELETE FROM web.r_user_crew WHERE web.r_user_crew.crew_id = param_crew_id;

        -- Insert new entries for the given user IDs
        INSERT INTO web.r_user_crew (user_id, crew_id)
        SELECT changed_members, param_crew_id
        FROM unnest(param_members) AS changed_members; -- Change this alias to the one you used in your actual query
    END IF;

    -- Return the members only if param_members is provided
    IF param_members IS NOT NULL THEN
        members := ARRAY(
            SELECT
                jsonb_build_object(
                    'user_id', u.id,
                    'user_nickname', u.nickname,
                    'user_firstname', u.firstname,
                    'user_lastname', u.lastname,
                    'user_picture', u.picture
                )
            FROM
                web.r_user_crew cr
            JOIN
                main."user" u ON cr.user_id = u.id
            WHERE
                cr.crew_id = param_crew_id
        );
    END IF;

    -- Return the updated crew along with members
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui supprime les infos d'un équipage d'un utilisateur
CREATE OR REPLACE FUNCTION web.delete_user_crew(
    userId int,
    crew_id_param int
)
RETURNS BOOLEAN
AS $$
DECLARE
    result_boolean BOOLEAN;
BEGIN
    -- Attempt to delete links from r_user_crew
    DELETE FROM web.r_user_crew WHERE crew_id = crew_id_param;

    -- Check if any rows were deleted
    IF FOUND THEN
        -- Delete the crew
        DELETE FROM web.crew WHERE web.crew.id = crew_id_param;
        result_boolean := true;
    ELSE
        result_boolean := false;
    END IF;

    RETURN result_boolean;
END;
$$ LANGUAGE plpgsql;
