CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(50),
    region_polygon GEOMETRY(POLYGON)
);

CREATE TABLE shop_features (
    feature_id SERIAL PRIMARY KEY,
    creditcard_accepted BOOLEAN,
    accessibility BOOLEAN,
    customer_service BOOLEAN,
    operate_24_7 BOOLEAN,
    takeout BOOLEAN
);

CREATE TABLE shops (
    shop_id SERIAL PRIMARY KEY,
    shop_name VARCHAR(100),
    shop_address VARCHAR(300),
    shop_region INTEGER REFERENCES regions,
    shop_img_url VARCHAR(2100),
    shop_price_lower_bound INTEGER,
    shop_price_higher_bound INTEGER,
    shop_feature INTEGER REFERENCES shop_features UNIQUE,
    shop_location GEOMETRY(POINT)
);
