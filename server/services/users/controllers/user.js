const User = require('../models/user');
const { hashPassword } = require('../helpers/bcrypt');

class UserController {
  static async findAllUsers(_, res, next) {
    try {
      const data = await User.findAll();

      const mappedUsers = data.map((user) => UserController.#mapToModel(user));

      res.status(200).json({
        statusCode: 200,
        data: mappedUsers,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const {
        username,
        email,
        password,
        phoneNumber,
        address,
        role = 'Admin',
      } = req.body;

      if (!email) {
        throw { name: 'Email is required' };
      }
      if (!password) {
        throw { name: 'Password is required' };
      }

      const hashedPassword = hashPassword(password);

      const newUser = await User.createUser({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        role,
      });

      res.status(201).json({
        statusCode: 201,
        message: 'User created successfully',
        data: {
          id: newUser.insertedId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async findUserById(req, res, next) {
    try {
      const { id } = req.params;

      const foundUser = await User.findById(id);

      if (!foundUser) {
        throw { name: 'Data not found' };
      }

      const mappedUser = UserController.#mapToModel(foundUser);

      res.status(200).json({
        statusCode: 200,
        data: mappedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(req, res, next) {
    try {
      const { id } = req.params;

      const { deletedCount } = await User.deleteById(id);
      if (!deletedCount) {
        throw { name: 'Data not found' };
      }

      res.status(200).json({
        statusCode: 200,
        message: `User with id ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  static #mapToModel(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    };
  }
}

module.exports = UserController;
