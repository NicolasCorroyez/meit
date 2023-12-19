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