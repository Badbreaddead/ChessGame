#!/bin/bash
set -e
# TODO move all passwords to secure storage
export PGPASSWORD=postgres;
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
  CREATE DATABASE chess;
  GRANT ALL PRIVILEGES ON DATABASE chess TO "postgres";
EOSQL