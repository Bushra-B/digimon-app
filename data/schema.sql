DROP TABLE IF EXISTS digimons;

CREATE TABLE digimons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    img VARCHAR(255),
    level VARCHAR(255)
)