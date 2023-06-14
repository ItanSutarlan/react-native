const axios = require('axios');
const CacheService = require('../services/redis/cacheService');

const cacheService = new CacheService();
const userBaseUrl = process.env.USER_BASE_URL;

class UserController {
  static async findAllUsers(_, res, next) {
    try {
      let users = JSON.parse(await cacheService.get('users'));

      if (!users) {
        const { data: response } = await axios.get(`${userBaseUrl}/users`);
        await cacheService.set('users', JSON.stringify(response.data));
        users = response.data;
      }

      res.status(200).json({
        statusCode: 200,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      const { data: response } = await axios.post(`${userBaseUrl}/users`, {
        username,
        email,
        password,
        phoneNumber,
        address,
      });

      await cacheService.delete('users');

      res.status(201).json({
        statusCode: 201,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findUserById(req, res, next) {
    try {
      const { id } = req.params;

      const { data: response } = await axios.get(`${userBaseUrl}/users/${id}`);

      res.status(200).json({
        statusCode: 200,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(req, res, next) {
    try {
      const { id } = req.params;

      const { data: response } = await axios.delete(
        `${userBaseUrl}/users/${id}`,
      );

      await cacheService.delete('users');

      res.status(200).json({
        statusCode: 200,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
