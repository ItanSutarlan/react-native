const express = require('express');
const postRoutes = require('./post');
const categoryRoutes = require('./category');
const publicRoutes = require('./public');

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);

router.use('/public', publicRoutes);

module.exports = router;
