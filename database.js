const postgres = require('pg')
const connectionString = process.env.DATABASE_URL

// Initialize postgres client
postgres.defaults.ssl = false;
const client = new postgres.Client({
    ssl: false
})

// Connect to the DB
client.connect().then(() => {
  console.log(`Connected To ${client.database} at ${client.host}:${client.port}`)
}).catch(console.log)

module.exports = {
    /** Query the current time */
    queryTime: async () => {
      const result = await client.query('SELECT NOW() as now')
      return result.rows[0]
    },

    addShop: async (shop) => {
        const query = {
            text: `WITH rows AS (
                INSERT INTO shop_features (
                    creditcard_accepted,
                    accessibility,
                    customer_service,
                    operate_24_7,
                    takeout) VALUES ($1, $2, $3, $4, $5) RETURNING feature_id
             )
             INSERT INTO shops (
                shop_name,
                shop_address,
                shop_region,
                shop_img_url,
                shop_price_lower_bound,
                shop_price_higher_bound,
                shop_feature,
                shop_location) 
                SELECT $6, $7, $8, $9, $10, $11, feature_id, ST_SetSRID(ST_POINT($12, $13), 4326) FROM rows RETURNING shop_id;
             `,
            values: [shop.feat.cc_acc, shop.feat.access, shop.feat.cs, shop.feat.allhr, shop.feat.takeout,
                shop.name, shop.addr, shop.reg, shop.img, shop.price[0], shop.price[1], shop.loc[1], shop.loc[0]]
        }
        const result = await client.query(query)
        return result.rows[0]
    },

    queryShopGeoJSON: async (box) => {
        const query = {
            text: `select json_build_object('type','FeatureCollection', 
                                            'features', json_agg(jsonb_build_object(
                                                'type','Feature', 
                                                'geometry', ST_AsGeoJSON(shop_location)::jsonb, 
                                                'properties', to_jsonb(row) - 'shop_id' - 'shop_location'))) 
                    myjson from (select * from shops where 
                            ST_Intersects(shop_location, 
                                        ST_MakeEnvelope($1, $2, $3, $4, 4326 ))) as row;`,
            values: [box.sw[1], box.sw[0], box.ne[1], box.ne[0]]
        }
        const result = await client.query(query)
        return result.rows[0].myjson
    }
}
