CREATE TABLE IF NOT EXISTS elements (
    hash CHAR(40) NOT NULL,
    screen CHAR(40) NOT NULL,
    type VARCHAR(20) NOT NULL,
    x INT(2) NOT NULL,
    y INT(2) NOT NULL,
    width INT(2) NOT NULL,
    height INT(2) NOT NULL,
    color CHAR(7),
    url VARCHAR(50),
    text VARCHAR(250),
    UNIQUE (hash)
);