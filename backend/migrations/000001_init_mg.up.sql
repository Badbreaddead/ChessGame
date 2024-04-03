CREATE TABLE IF NOT EXISTS games(
    id SERIAL NOT NULL PRIMARY KEY,
    -- TODO when switching to auth provider ownerId should be changed to SERIAL
    ownerId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    pgn VARCHAR(1000) NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE default timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS inx_game_owners ON games(ownerId);