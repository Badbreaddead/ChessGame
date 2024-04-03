#!/bin/bash
set -e

export PGPASSWORD=$2;

psql -v ON_ERROR_STOP=1 --username $1 --dbname "postgres" <<-EOSQL
  CREATE DATABASE chess_game;
  GRANT ALL PRIVILEGES ON DATABASE chess_game TO $1;
EOSQL