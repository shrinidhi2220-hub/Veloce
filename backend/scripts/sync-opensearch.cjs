require('dotenv').config();
const { prisma } = require('../src/config/database');
const { syncProductsToOpenSearch } = require('../src/services/openSearchService');

async function main() {
  const result = await syncProductsToOpenSearch(prisma);
  console.log(`Indexed ${result.indexed} active VELOCE product(s) into OpenSearch.`);
}

main()
  .catch(error => {
    console.error('OpenSearch sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());