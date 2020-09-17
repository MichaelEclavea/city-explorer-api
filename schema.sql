DROP TABLE IF EXISTS city_data;

CREATE TABLE city_data (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude INT,
    longitude INT
);