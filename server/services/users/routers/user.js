const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.get('/', UserController.findAllUsers);
router.get('/:id', UserController.findUserById);
router.post('/', UserController.createUser);
router.delete('/:id', UserController.deleteUserById);

module.exports = router;
