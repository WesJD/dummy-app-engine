CREATE TABLE IF NOT EXISTS screens (
    hash CHAR(40) NOT NULL,
    project CHAR(40) NOT NULL,
    place INT(2) NOT NULL,
    UNIQUE (hash)
);