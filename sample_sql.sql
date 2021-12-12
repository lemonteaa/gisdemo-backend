INSERT INTO regions (region_name, region_polygon) VALUES ('Test reg', ST_POLYGON(ST_GeomFromText('LINESTRING(75 29,77 29,77 29, 75 29)'), 4326));

WITH rows AS (
   INSERT INTO shop_features (creditcard_accepted, takeout) VALUES ( True, True) RETURNING feature_id
)
INSERT INTO shops (shop_feature) SELECT feature_id FROM rows RETURNING shop_id;


select json_build_object('type','FeatureCollection', 
                         'features', json_agg(jsonb_build_object(
                            'type','Feature', 
                            'geometry', ST_AsGeoJSON(shop_location)::jsonb, 
                            'properties', to_jsonb(row) - 'shop_id' - 'shop_location'))) 
    myjson from (select * from shops where 
    ST_Intersect(shop_location, ST_MakeEnvelope(SW_longitude, SW_latitude, NE_longitude, NE_latitude, 4326 ))) as row;
