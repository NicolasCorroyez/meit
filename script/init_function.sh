## J'exécute les commandes suivantes en tant que admin_space
export PGUSER=admin_space
export PGPASSWORD=space
export PGDATABASE=spacevoyager

# I DELETE FUNCTIONS
psql -f ./sql/fonction/delete_fonction.sql

# I ADD FUNCTIONS
psql -f ./sql/fonction/booking.sql
psql -f ./sql/fonction/hostel.sql
psql -f ./sql/fonction/planet.sql
psql -f ./sql/fonction/user.sql
