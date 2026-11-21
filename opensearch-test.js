require("dotenv").config();

const { Client } = require("@opensearch-project/opensearch");

const client = new Client({
  node: process.env.OPENSEARCH_URL,
  auth: {
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    const response = await client.info();

    console.log("Connected to Aiven OpenSearch!");
    console.log("Cluster name:", response.body.cluster_name);
    console.log("OpenSearch version:", response.body.version.number);
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testConnection();
