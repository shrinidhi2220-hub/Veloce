require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    await client.connect();
    console.log("Connected to Aiven PostgreSQL!");

    const result = await client.query("SELECT NOW() AS server_time");

    console.log("Database server time:", result.rows[0].server_time);
  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await client.end().catch(() => {});
  }
}

testConnection();
