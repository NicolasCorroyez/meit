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
-- fonction qui édite un utilisateur
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS main.user AS $$
DECLARE
    user_db main.user;
BEGIN
    -- Extraire les détails de l'utilisateur de la base de données
    SELECT id, nickname, firstname, lastname, device, picture
    INTO user_db
    FROM main.user WHERE id = (u->>'id')::int;

    -- Gérer le cas où l'enregistrement de l'utilisateur n'existe pas
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur avec l''ID % non trouvé', (u->>'id')::int;
    END IF;

    -- Mettre à jour les détails de l'utilisateur en fonction du JSON fourni
    user_db.nickname := COALESCE(u->>'nickname', user_db.nickname);
    user_db.firstname := COALESCE(u->>'firstname', user_db.firstname);
    user_db.lastname := COALESCE(u->>'lastname', user_db.lastname);
    user_db.device := COALESCE(u->>'device', user_db.device);
    user_db.picture := COALESCE(u->>'picture', user_db.picture);

    -- Mettre à jour l'utilisateur dans la table main.user et retourner les champs modifiés
    UPDATE main.user
    SET
        nickname = user_db.nickname,
        firstname = user_db.firstname,
        lastname = user_db.lastname,
        device = user_db.device,
        picture = user_db.picture
    WHERE
        id = (u->>'id')::int
    RETURNING * INTO user_db;

    -- Retourner l'utilisateur mis à jour
    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-------------------------------------------------------------------------------------------------- !
-- fonction qui supprime un utilisateur et retourne true ou false
CREATE OR REPLACE FUNCTION web.delete_user(user_id int)
RETURNS BOOLEAN
AS $$
BEGIN
    -- Check if the user exists
    IF EXISTS (
        SELECT 1
        FROM main.user
        WHERE id = user_id
    ) THEN
        -- Delete the user
        DELETE FROM main.user
        WHERE id = user_id;

        -- Return true indicating successful deletion
        RETURN true;
    ELSE
        -- If user does not exist, return false
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;