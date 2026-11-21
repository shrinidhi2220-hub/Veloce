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

const products = [
  {
    product_id: "P101",
    name: "Apple iPhone 16",
    description: "Apple smartphone with advanced camera",
    category: "Electronics",
    brand: "Apple",
    city: "Bengaluru",
    price: 79900,
    image_url: "https://example.com/iphone.jpg",
  },
  {
    product_id: "P102",
    name: "Samsung Galaxy S25",
    description: "Samsung flagship Android smartphone",
    category: "Electronics",
    brand: "Samsung",
    city: "Bengaluru",
    price: 84999,
    image_url: "https://example.com/samsung.jpg",
  },
  {
    product_id: "P103",
    name: "HP Pavilion Laptop",
    description: "Laptop for programming and productivity",
    category: "Electronics",
    brand: "HP",
    city: "Mysuru",
    price: 65000,
    image_url: "https://example.com/hp.jpg",
  },
  {
    product_id: "P104",
    name: "Sony Wireless Headphones",
    description: "Wireless noise cancelling headphones",
    category: "Accessories",
    brand: "Sony",
    city: "Bengaluru",
    price: 5999,
    image_url: "https://example.com/sony.jpg",
  },
  {
    product_id: "P105",
    name: "Nike Running Shoes",
    description: "Lightweight running shoes for sports",
    category: "Footwear",
    brand: "Nike",
    city: "Chennai",
    price: 4500,
    image_url: "https://example.com/nike.jpg",
  },
];

async function insertProducts() {
  try {
    const operations = products.flatMap((product) => [
      {
        index: {
          _index: indexName,
          _id: product.product_id,
        },
      },
      product,
    ]);

    const response = await client.bulk({
      body: operations,
      refresh: true,
    });

    if (response.body.errors) {
      console.error("Some products failed to index.");

      response.body.items.forEach((item, index) => {
        if (item.index.error) {
          console.error(products[index].product_id, item.index.error);
        }
      });

      return;
    }

    console.log("Successfully indexed", products.length, "products!");
  } catch (error) {
    console.error("Product indexing failed:", error.message);
  }
}

insertProducts();
