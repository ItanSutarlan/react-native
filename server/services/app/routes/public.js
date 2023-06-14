const express = require('express');
const PostController = require('../controllers/post');
const CategoryController = require('../controllers/category');
const router = express.Router();

router.get('/posts', PostController.getPosts);
router.get('/posts/:slug', PostController.getPostBySlug);

router.get('/categories', CategoryController.getCategories);

module.exports = router;
