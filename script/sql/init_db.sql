-- je crèe le rôle "admin_meit" qui a tous les droits
CREATE ROLE admin_meit WITH LOGIN PASSWORD 'Pnv11e!29mr?';

-- je crèe le rôle "member_meit" qui sera le compte utilisé par notre solution NodeJS pour se connecter à la bdd
CREATE ROLE member_meit WITH LOGIN PASSWORD 'oiUHfe783kd!';

-- création des groupes
CREATE ROLE group_web;
CREATE ROLE group_administration;

-- ajout dans les groupes
GRANT group_web TO member_meit;
GRANT group_web TO admin_meit;

GRANT group_administration TO admin_meit;

-- je crèe la BDD "meit"
CREATE DATABASE meit OWNER admin_meit;