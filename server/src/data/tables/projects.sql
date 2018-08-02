CREATE TABLE IF NOT EXISTS projects (
    hash CHAR(40) NOT NULL,
    owner DECIMAL(21, 0) NOT NULL,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(50) NOT NULL,
    UNIQUE (hash)
);