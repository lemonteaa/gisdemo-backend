const postgres = require('pg')
const connectionString = process.env.DATABASE_URL

// Initialize postgres client
postgres.defaults.ssl = false;
const client = new postgres.Client({ connectionString })

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
                SELECT $6, $7, $8, $9, $10, $11, feature_id, ST_POINT($12, $13) FROM rows RETURNING shop_id;
             `,
            values: [shop.feat.cc_acc, shop.feat.access, shop.feat.cs, shop.feat.allhr, shop.feat.takeout,
                shop.name, shop.addr, shop.reg, shop.img, shop.price[0], shop.price[1], shop.loc[0], shop.loc[1]]
        }
        const result = await client.query(query)
        return result.rows[0]
    }
}
