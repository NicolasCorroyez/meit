# Init de la db

export PGUSER=postgres

## suppression de l'existant
dropdb meit
dropuser admin_meit
dropuser member_meit

## ajout du role et de la bdd
psql -f ./sql/init_db.sql

## suppression du schéma public
psql -d meit -f ./sql/delete_public.sql

## ajout des tables
export PGUSER=admin_meit
export PGPASSWORD=meit
export PGDATABASE=meit

psql -f ./sql/create_tables.sql

## import des données
node ./js/importData.js 