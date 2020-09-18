DROP TABLE IF EXISTS city_data;
DROP TABLE IF EXISTS weather_data;

CREATE TABLE city_data (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude decimal,
    longitude decimal
);

INSERT INTO city_data (search_query) VALUES ('tokyo');

SELECT * FROM city_data;


CREATE TABLE weather_data(
    id SERIAL PRIMARY KEY, 
    search_query VARCHAR(255),
    forecast VARCHAR(255),
    forecast_time VARCHAR(255),
    search_timestamp VARCHAR(255)

);

SELECT * FROM weather_data;
