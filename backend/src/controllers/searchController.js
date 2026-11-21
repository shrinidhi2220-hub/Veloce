const { prisma } = require('../config/database');
const { searchIndexedProducts } = require('../services/openSearchService');

const productSelect = {
  id: true, name: true, description: true, category: true, brand: true,
  city: true, price: true, wholesalePrice: true, wholesaleQty: true,
  stock: true, images: true,
};

function positiveInt(value, fallback, max) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) return null;
  return parsed;
}

async function searchProducts(req, res, next) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (q.length > 200) return res.status(400).json({ success: false, message: 'Search query is too long.' });

    const page = positiveInt(req.query.page, 1, 100000);
    const limit = positiveInt(req.query.limit, 20, 100);
    if (!page || !limit) return res.status(400).json({ success: false, message: 'Invalid pagination values.' });

    const minPrice = req.query.minPrice === undefined ? undefined : Number(req.query.minPrice);
    const maxPrice = req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);
    if ((minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
        (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
        (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)) {
      return res.status(400).json({ success: false, message: 'Invalid price range.' });
    }

    const sortBy = req.query.sortBy || 'relevance';
    const sortOrder = req.query.sortOrder || 'asc';
    if (!['relevance', 'price', 'name'].includes(sortBy) || !['asc', 'desc'].includes(sortOrder)) {
      return res.status(400).json({ success: false, message: 'Invalid sort option.' });
    }

    const filters = {
      category: typeof req.query.category === 'string' ? req.query.category.trim() : undefined,
      city: typeof req.query.city === 'string' ? req.query.city.trim() : undefined,
      minPrice, maxPrice, page, limit, sortBy, sortOrder,
    };

    let indexed = null;
    let openSearchError = null;
    try {
      indexed = await searchIndexedProducts(q, filters);
    } catch (error) {
      openSearchError = error;
      console.warn('OpenSearch unavailable; using PostgreSQL search fallback:', error.message);
    }

    if (indexed) {
      const rows = indexed.ids.length
        ? await prisma.product.findMany({ where: { id: { in: indexed.ids }, isActive: true }, select: productSelect })
        : [];
      const byId = new Map(rows.map(row => [row.id, row]));
      const ordered = indexed.ids.map(id => byId.get(id)).filter(Boolean);
      return res.json({
        success: true,
        data: ordered,
        pagination: { total: indexed.total, page, limit, totalPages: Math.ceil(indexed.total / limit) },
        searchMode: 'opensearch',
      });
    }

    const where = { isActive: true };
    if (q) where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
    ];
    if (filters.category) where.category = filters.category;
    if (filters.city) where.city = filters.city;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy = sortBy === 'price'
      ? { price: sortOrder }
      : sortBy === 'name'
        ? { name: sortOrder }
        : { createdAt: 'desc' };
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, select: productSelect, skip: (page - 1) * limit, take: limit, orderBy }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      searchMode: 'postgresql-fallback',
      ...(openSearchError ? { searchNotice: 'Fuzzy search is temporarily unavailable; basic database search is active.' } : {}),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { searchProducts };