BEGIN;

-- CREATION DE SCHEMAS web et main pour anticiper la prochaine version du projet qui implémentera un utilisateur administrateur

-- je positionne mon groupe "group_administration" comme propriétaire des schémas
CREATE SCHEMA web AUTHORIZATION group_administration;
CREATE SCHEMA main AUTHORIZATION group_administration;

-- je donne le droit d'USAGE au groupe "group_web"
-- ce doit d'USAGE au niveau des fonctions de mon schéma, va me permettre de les appeler
GRANT USAGE ON SCHEMA web TO group_web;

-- je positionne le droit d'exécuter des fonctions au groupe "space_group_web" au niveau du schéma "web"
ALTER DEFAULT PRIVILEGES FOR ROLE admin_meit IN SCHEMA web
GRANT EXECUTE ON FUNCTIONS TO group_web; 

-- table qui contient les crew
CREATE TABLE web.crew (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    picture text,
    user_id int NOT NULL REFERENCES web.user(id)
);

-- table pour gérer les utilisateurs de mon application web
CREATE TABLE main.user (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname text NOT NULL UNIQUE,
    firstname text NOT NULL,
    lastname text NOT NULL,
    device text NOT NULL,
    picture text,
    role text NOT NULL DEFAULT 'member'
);

-- table qui contient les requests
CREATE TABLE web.request (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    theme text NOT NULL,
    date DATE,
    time TIME,
    place text,
    nb_people smallint CHECK(nb_people > 0),
    user_id int NOT NULL REFERENCES main.user(id)
);

-- table d'association entre user et request
CREATE TABLE web.r_user_request (
    id int GENERATED ALWAYS AS IDENTITY,
    user_id int PRIMARY KEY REFERENCES main.users(id),
    crew_id int PRIMARY KEY REFERENCES web.crew(id),
    request_id int PRIMARY KEY REFERENCES web.request(id),
    userstate BOOLEAN,
);

-- table d'association entre user et crew
CREATE TABLE web.r_user_crew (
    id int GENERATED ALWAYS AS IDENTITY,
    user_id int PRIMARY KEY REFERENCES main.user(id),
    crew_id int PRIMARY KEY REFERENCES web.crew(id),
);

COMMIT;