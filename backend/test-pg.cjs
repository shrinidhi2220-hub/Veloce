require("dotenv").config();
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
client.connect()
  .then(() => client.query("SELECT current_database() AS db, current_user AS usr"))
  .then(r => { console.log("✅ CONNECTED:", r.rows); return client.end(); })
  .catch(e => { console.log("❌ CODE:", e.code); console.log("❌ MSG:", e.message); process.exit(1); });
