const express = require('express');
const PostController = require('../controllers/post');
const router = express.Router();

router.post('/', PostController.postPost);
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPostById);
router.put('/:id', PostController.putPostById);
router.delete('/:id', PostController.deletePostById);

module.exports = router;
