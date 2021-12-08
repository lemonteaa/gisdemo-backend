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
    }
}
