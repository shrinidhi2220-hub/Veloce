const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const searchController = require('../controllers/searchController');

router.get('/', productController.getProducts);
router.get('/search', searchController.searchProducts);
router.get('/:id', productController.getProductById);

module.exports = router;