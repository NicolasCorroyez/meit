## J'exécute les commandes suivantes en tant que admin_space
export PGUSER=admin_meit
export PGPASSWORD=meit
export PGDATABASE=meit

# I DELETE FUNCTIONS
psql -f script/sql/fonction/delete_fonction.sql

# I ADD FUNCTIONS
psql -f script/sql/fonction/user.sql
psql -f script/sql/fonction/friend.sql
psql -f script/sql/fonction/crew.sql
psql -f script/sql/fonction/event.sql