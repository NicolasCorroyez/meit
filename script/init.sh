# Init de la db

export PGUSER=postgres

## suppression de l'existant
dropdb meit
dropuser admin_meit
dropuser member_meit

## ajout du role et de la bdd
psql -f /Users/nicolascorroyez/Documents/ProjetP/meit/script/sql/init_db.sql

## suppression du schéma public
psql -d meit -f /Users/nicolascorroyez/Documents/ProjetP/meit/script/sql/delete_public.sql

## ajout des tables
export PGUSER=admin_meit
export PGPASSWORD=meit
export PGDATABASE=meit

psql -f /Users/nicolascorroyez/Documents/ProjetP/meit/script/sql/create_tables.sql

## import des données
node /Users/nicolascorroyez/Documents/ProjetP/meit/script/js/importData.js