CREATE TABLE IF NOT EXISTS accounts (
    id DECIMAL(21, 0) NOT NULL,
    name VARCHAR(75) NOT NULL,
    UNIQUE (id)
);