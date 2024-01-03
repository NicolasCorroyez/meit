-- ! FRIEND FUNCTIONS
-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos de tous les amis d'utilisateur
CREATE OR REPLACE FUNCTION web.get_user_all_friends(param_user_id int)
RETURNS TABLE (
friend_id int,
friend_nickname text,
friend_firstname text,
friend_lastname text,
friend_picture text)
AS $$
BEGIN
    RETURN QUERY
    SELECT
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

-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos d'un amis d'un utilisateur
CREATE OR REPLACE FUNCTION web.get_user_one_friend(param_user_id int, param_friend_id int)
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

-------------------------------------------------------------------------------------------------- !
-- fonction qui insère un ami dans la table d'un utilisateur et retourne les détails de l'ami ajouté
CREATE OR REPLACE FUNCTION web.insert_user_friend(param_user_id int, param_friend_id int)
RETURNS main.user
AS $$
DECLARE
    friend_details main.user;
BEGIN
    -- Check if the friendship already exists
    IF EXISTS (
        SELECT 1
        FROM web.contact c
        WHERE c.user_id = param_user_id AND c.friend_id = param_friend_id
    ) THEN
        RAISE EXCEPTION 'L''amitié existe déjà';
    END IF;

    -- Insert the friend into the web.contact table with friendship_confirmed set to false
    INSERT INTO web.contact (user_id, friend_id, friendship_confirmed)
    VALUES (param_user_id, param_friend_id, false);

    -- Retrieve the details of the added friend
    SELECT u.*
    INTO friend_details
    FROM main.user u
    WHERE u.id = param_friend_id;

    -- Return the details of the added friend
    RETURN friend_details;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui supprime un ami dans la table d'un utilisateur et retourne true ou false
CREATE OR REPLACE FUNCTION web.delete_user_friend(param_user_id int, param_friend_id int)
RETURNS BOOLEAN
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

        -- Return true indicating successful deletion
        RETURN true;
    ELSE
        -- If friendship does not exist, return false
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------------------------------------- !
-- fonction qui récupere les friendship request pending (false)
-- ! Not getting all friendship requests
CREATE OR REPLACE FUNCTION web.get_pending_friendship_requests(param_user_id int)
RETURNS TABLE (
    friendship_id int,
    friend_id int,
    friend_nickname text,
    friend_firstname text,
    friend_lastname text,
    friend_picture text
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS friendship_id,
        c.user_id AS friend_id,
        u.nickname AS friend_nickname,
        u.firstname AS friend_firstname,
        u.lastname AS friend_lastname,
        u.picture AS friend_picture
    FROM
        web.contact c
    INNER JOIN
        main.user u ON c.user_id = u.id
    WHERE
        c.friend_id = param_user_id
        AND NOT c.friendship_confirmed;
END;
$$ LANGUAGE plpgsql;
