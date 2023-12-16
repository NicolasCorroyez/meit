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

-- table pour gérer les utilisateurs de mon application web
CREATE TABLE main.users (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname text NOT NULL UNIQUE,
    firstname text NOT NULL,
    lastname text NOT NULL,
    device text NOT NULL,
    picture text,
    role text NOT NULL DEFAULT 'member'
);

-- table qui contient les crews
CREATE TABLE web.crews (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    picture text,
    users_id int NOT NULL REFERENCES main.users(id)
);

-- table qui contient les eventss
CREATE TABLE web.events (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    theme text NOT NULL,
    date DATE,
    time TIME,
    place text,
    nb_people smallint CHECK(nb_people > 0),
    owner int NOT NULL REFERENCES main.users(id)
);

-- table d'association entre users et events
CREATE TABLE web.r_users_events (
    id int GENERATED ALWAYS AS IDENTITY,
    users_id int REFERENCES main.users(id),
    crews_id int REFERENCES web.crews(id), -- This is weird but only way i can see to include crews names
    events_id int REFERENCES web.events(id),
    userstate BOOLEAN
);

-- table d'association entre users et crews
CREATE TABLE web.r_users_crews (
    id int GENERATED ALWAYS AS IDENTITY,
    users_id int REFERENCES main.users(id),
    crews_id int REFERENCES web.crews(id)
);

COMMIT;