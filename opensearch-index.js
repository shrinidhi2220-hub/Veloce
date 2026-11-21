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

const indexName = "veloce-products";

const indexMapping = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 1,
    },
  },

  mappings: {
    properties: {
      product_id: { type: "keyword" },
      name: { type: "text" },
      description: { type: "text" },
      category: { type: "keyword" },
      brand: { type: "keyword" },
      city: { type: "keyword" },
      price: { type: "double" },
      image_url: { type: "keyword", index: false },
    },
  },
};

async function createIndex() {
  try {
    const exists = await client.indices.exists({
      index: indexName,
    });

    if (exists.body) {
      console.log("Index already exists:", indexName);
      return;
    }

    await client.indices.create({
      index: indexName,
      body: indexMapping,
    });

    console.log("OpenSearch index created:", indexName);
  } catch (error) {
    console.error("Index creation failed:", error.message);
  }
}

createIndex();
