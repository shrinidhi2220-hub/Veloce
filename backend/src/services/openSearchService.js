const fs = require('fs');
const { Client } = require('@opensearch-project/opensearch');

const INDEX_NAME = process.env.OPENSEARCH_INDEX || 'veloce-products';
let client;

function getOpenSearchClient() {
  if (client) return client;

  const node = process.env.OPENSEARCH_URL;
  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;
  if (!node || !username || !password) return null;

  const ssl = { rejectUnauthorized: true };
  const caPath = process.env.OPENSEARCH_CA_PATH;
  if (caPath) ssl.ca = fs.readFileSync(caPath);

  client = new Client({ node, auth: { username, password }, ssl });
  return client;
}

function getBody(response) {
  return response && response.body !== undefined ? response.body : response;
}

async function ensureProductIndex(searchClient) {
  const existsResponse = await searchClient.indices.exists({ index: INDEX_NAME });
  const existsBody = getBody(existsResponse);
  const exists = typeof existsBody === 'boolean'
    ? existsBody
    : Boolean(existsBody && (existsBody.statusCode === 200 || existsBody.exists));
  if (exists) return;

  try {
    await searchClient.indices.create({
      index: INDEX_NAME,
      body: {
        settings: { number_of_shards: 1, number_of_replicas: 0 },
        mappings: {
          properties: {
            productId: { type: 'keyword' },
            name: { type: 'text', fields: { keyword: { type: 'keyword', ignore_above: 256 } } },
            description: { type: 'text' },
            brand: { type: 'keyword' },
            category: { type: 'keyword' },
            city: { type: 'keyword' },
            price: { type: 'double' },
            wholesalePrice: { type: 'double' },
            wholesaleQty: { type: 'integer' },
            stock: { type: 'integer' },
            isActive: { type: 'boolean' },
          },
        },
      },
    });
  } catch (error) {
    if (error.meta && error.meta.statusCode === 400) {
      const message = JSON.stringify(getBody(error.meta.body) || {});
      if (message.toLowerCase().includes('resource_already_exists')) return;
    }
    throw error;
  }
}

function toDocument(product) {
  return {
    productId: product.id,
    name: product.name,
    description: product.description || '',
    brand: product.brand || '',
    category: product.category,
    city: product.city,
    price: product.price,
    wholesalePrice: product.wholesalePrice,
    wholesaleQty: product.wholesaleQty,
    stock: product.stock,
    isActive: product.isActive,
  };
}

async function syncProductsToOpenSearch(prisma) {
  const searchClient = getOpenSearchClient();
  if (!searchClient) throw new Error('OpenSearch is not configured. Set OPENSEARCH_URL, OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD.');
  await ensureProductIndex(searchClient);

  const products = await prisma.product.findMany({ where: { isActive: true } });
  if (products.length === 0) return { indexed: 0 };

  const body = products.flatMap(product => [
    { index: { _index: INDEX_NAME, _id: product.id } },
    toDocument(product),
  ]);
  const response = getBody(await searchClient.bulk({ body, refresh: true }));
  if (response.errors) {
    const failures = (response.items || []).filter(item => item.index && item.index.error);
    throw new Error(`OpenSearch bulk indexing failed for ${failures.length} product(s).`);
  }
  return { indexed: products.length };
}

async function searchIndexedProducts(searchText, filters = {}) {
  const searchClient = getOpenSearchClient();
  if (!searchClient) return null;

  const existsResponse = await searchClient.indices.exists({ index: INDEX_NAME });
  const existsBody = getBody(existsResponse);
  const exists = typeof existsBody === 'boolean'
    ? existsBody
    : Boolean(existsBody && (existsBody.statusCode === 200 || existsBody.exists));
  if (!exists) return null;

  const filterConditions = [];
  if (filters.category) filterConditions.push({ term: { category: filters.category } });
  if (filters.city) filterConditions.push({ term: { city: filters.city } });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const range = {};
    if (filters.minPrice !== undefined) range.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) range.lte = filters.maxPrice;
    filterConditions.push({ range: { price: range } });
  }

  const query = searchText
    ? [{ multi_match: { query: searchText, fields: ['name^3', 'description', 'brand'], fuzziness: 'AUTO', prefix_length: 1 } }]
    : [{ match_all: {} }];

  let sort;
  if (filters.sortBy === 'price') sort = [{ price: { order: filters.sortOrder || 'asc' } }];
  else if (filters.sortBy === 'name') sort = [{ 'name.keyword': { order: filters.sortOrder || 'asc' } }];
  else sort = ['_score', { 'name.keyword': { order: 'asc' } }];

  const response = getBody(await searchClient.search({
    index: INDEX_NAME,
    body: {
      from: (filters.page - 1) * filters.limit,
      size: filters.limit,
      query: { bool: { must: query, filter: filterConditions } },
      sort,
    },
  }));

  const hits = response.hits && response.hits.hits ? response.hits.hits : [];
  const totalValue = response.hits && response.hits.total;
  const total = typeof totalValue === 'number' ? totalValue : (totalValue && totalValue.value) || 0;
  return { ids: hits.map(hit => hit._source.productId).filter(Boolean), total };
}

module.exports = { getOpenSearchClient, syncProductsToOpenSearch, searchIndexedProducts };