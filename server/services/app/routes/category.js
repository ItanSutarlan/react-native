const express = require('express');
const CategoryController = require('../controllers/category');
const router = express.Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', CategoryController.postCategories);
router.put('/:id', CategoryController.putCategoryById);
router.delete('/:id', CategoryController.deleteCategoryById);

module.exports = router;
