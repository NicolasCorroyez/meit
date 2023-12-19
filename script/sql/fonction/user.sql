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
