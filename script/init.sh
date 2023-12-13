# Init de la db

export PGUSER=postgres

## suppression de l'existant
dropdb spacevoyager
dropuser admin_space
dropuser member_space

## ajout du role et de la bdd
psql -f ./sql/init_db.sql

## suppression du schéma public
psql -d spacevoyager -f ./sql/delete_public.sql

## ajout des tables
export PGUSER=admin_space
export PGPASSWORD=space
export PGDATABASE=spacevoyager

psql -f ./sql/create_tables.sql

## import des données
node ./js/importData.js 