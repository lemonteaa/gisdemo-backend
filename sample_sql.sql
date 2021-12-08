INSERT INTO regions (region_name, region_polygon) VALUES ('Test reg', ST_POLYGON(ST_GeomFromText('LINESTRING(75 29,77 29,77 29, 75 29)'), 4326));

WITH rows AS (
   INSERT INTO shop_features (creditcard_accepted, takeout) VALUES ( True, True) RETURNING feature_id
)
INSERT INTO shops (shop_feature) SELECT feature_id FROM rows RETURNING shop_id;
