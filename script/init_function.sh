## J'exécute les commandes suivantes en tant que admin_space
export PGUSER=admin_meit
export PGPASSWORD=meit
export PGDATABASE=meit

# I DELETE FUNCTIONS
psql -f ./sql/fonction/delete_fonction.sql

# I ADD FUNCTIONS
