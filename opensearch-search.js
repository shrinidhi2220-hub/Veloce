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

async function searchProducts(searchText = "", filters = {}) {
  try {
    // Validate search text
    if (typeof searchText !== "string") {
      throw new Error("Search text must be a string.");
    }

    if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
      throw new Error("Filters must be an object.");
    }

    const {
      category,
      city,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = "relevance",
      sortOrder = "asc",
    } = filters;

    // Validate pagination
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new Error("Page must be a positive integer.");
    }

    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    // Validate price filters
    if (
      minPrice !== undefined &&
      (!Number.isFinite(minPrice) || minPrice < 0)
    ) {
      throw new Error("Minimum price must be a non-negative number.");
    }

    if (
      maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)
    ) {
      throw new Error("Maximum price must be a non-negative number.");
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new Error("Minimum price cannot exceed maximum price.");
    }

    if (category !== undefined && typeof category !== "string") {
      throw new Error("Category must be a string.");
    }

    if (city !== undefined && typeof city !== "string") {
      throw new Error("City must be a string.");
    }

    if (!["relevance", "price", "name"].includes(sortBy)) {
      throw new Error("Invalid sort field.");
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      throw new Error("Sort order must be asc or desc.");
    }

    // Build filters
    const filterConditions = [];

    if (category && category.trim()) {
      filterConditions.push({
        term: { category: category.trim() },
      });
    }

    if (city && city.trim()) {
      filterConditions.push({
        term: { city: city.trim() },
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceRange = {};

      if (minPrice !== undefined) {
        priceRange.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        priceRange.lte = maxPrice;
      }

      filterConditions.push({
        range: { price: priceRange },
      });
    }

    // Build search query
    const mustConditions = searchText.trim()
      ? [
          {
            multi_match: {
              query: searchText.trim(),
              fields: ["name^3", "description"],
              fuzziness: "AUTO",
              prefix_length: 1,
            },
          },
        ]
      : [{ match_all: {} }];

    // Build sorting
    let sort;

    if (sortBy === "price") {
      sort = [{ price: { order: sortOrder } }];
    } else if (sortBy === "name") {
      sort = [{ name: { order: sortOrder } }];
    } else {
      sort = ["_score", { name: { order: "asc" } }];
    }

    // Execute search
    const response = await client.search({
      index: indexName,
      from: (page - 1) * limit,
      size: limit,
      body: {
        query: {
          bool: {
            must: mustConditions,
            filter: filterConditions,
          },
        },
        sort,
      },
    });

    const hits = response.body.hits.hits;
    const total = response.body.hits.total.value;

    const products = hits.map((item) => ({
      product_id: item._source.product_id,
      name: item._source.name,
      category: item._source.category,
      city: item._source.city,
      price: item._source.price,
      score: item._score,
    }));

    console.log("\n========== PRODUCT SEARCH ==========");
    console.log("Search:", searchText || "All products");
    console.log("Filters:", filters);
    console.log("Page:", page);
    console.log("Limit:", limit);
    console.log("Sort:", sortBy, sortOrder);
    console.log("Total matching products:", total);
    console.log("Total pages:", Math.ceil(total / limit));
    console.log("------------------------------------");

    if (products.length === 0) {
      console.log("No matching products found.");
      return {
        products: [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    console.table(products);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Search failed:", error.message);
    return null;
  }
}

// Test combined search, filters, pagination and sorting
searchProducts("iphnoe", {
  category: "Electronics",
  city: "Bengaluru",
  minPrice: 10000,
  maxPrice: 90000,
  page: 1,
  limit: 5,
  sortBy: "price",
  sortOrder: "asc",
});
