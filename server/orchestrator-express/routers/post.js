const express = require('express');
const PostController = require('../controllers/post');
const router = express.Router();

router.post('/', PostController.createPost);
router.get('/', PostController.getPosts);
router.get('/:slug', PostController.getPostBySlug);
router.put('/:id', PostController.putPostById);
router.delete('/:id', PostController.deletePostById);

module.exports = router;
