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

-- fonction qui vérifie les données passées pour se connecter
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS main.user AS $$
	SELECT *
	FROM main.user
	WHERE nickname=u->>'nickname';

$$ LANGUAGE sql SECURITY DEFINER;

-- fonction qui supprime une catégorie
CREATE OR REPLACE FUNCTION web.delete_user(user_id int) RETURNS main.user AS $$ -- void signifie qu'on ne retourne rien
    DELETE FROM main.user
	WHERE id=user_id RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

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