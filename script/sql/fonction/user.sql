-- ! USER FUNCTIONS
-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos de tous les utilisateurs
CREATE OR REPLACE FUNCTION web.get_all_users() RETURNS SETOF main.user AS $$
	SELECT *
	FROM main.user;

$$ LANGUAGE sql SECURITY DEFINER;

-------------------------------------------------------------------------------------------------- !
-- fonction qui recupere les infos d'un user
CREATE OR REPLACE FUNCTION web.get_one_user(user_id int) RETURNS main.user AS $$
	SELECT * FROM main.user WHERE main.user.id = user_id;

$$ LANGUAGE sql;

-------------------------------------------------------------------------------------------------- !
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

-------------------------------------------------------------------------------------------------- !
-- fonction qui edite un user
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS main.user AS $$
DECLARE
    user_db main.user;
BEGIN
    -- Extract user details from the database
    SELECT id, nickname, firstname, lastname, picture
    INTO user_db
    FROM main.user WHERE id = (u->>'id')::int;

    -- Handle the case where the user record does not exist
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with ID % not found', (u->>'id')::int;
    END IF;

    -- Update user details based on provided JSON
    user_db.nickname := COALESCE(u->>'nickname', user_db.nickname);
    user_db.firstname := COALESCE(u->>'firstname', user_db.firstname);
    user_db.lastname := COALESCE(u->>'lastname', user_db.lastname);
    user_db.picture := COALESCE(u->>'picture', user_db.picture);

    -- Update user in the main.user table
    UPDATE main.user
    SET
        nickname = user_db.nickname,
        firstname = user_db.firstname,
        lastname = user_db.lastname,
        picture = user_db.picture
    WHERE
        id = (u->>'id')::int;

    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------------------------------------------------------------------------- !
-- fonction qui supprime un user
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