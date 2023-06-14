const axios = require('axios');
const CacheService = require('../services/redis/cacheService');
const userBaseUrl = process.env.USER_BASE_URL;
const appBaseUrl = process.env.APP_BASE_URL;

const cacheService = new CacheService();

class PostController {
  static async createPost(req, res, next) {
    try {
      let { title, content, imgUrl, categoryId, tags, authorId } = req.body;

      const { data: response } = await axios.post(`${appBaseUrl}/posts`, {
        title,
        content,
        imgUrl,
        categoryId,
        tags,
        authorId,
      });

      await cacheService.delete('posts');

      res.status(201).json({
        statusCode: 201,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(req, res, next) {
    try {
      const { category } = req.query;

      let cachedPosts = await cacheService.get('posts');

      if (cachedPosts) {
        cachedPosts = JSON.parse(cachedPosts);
      }

      if (!cachedPosts || category) {
        const url = `${appBaseUrl}/public/posts${
          category ? `?category=${category}` : ''
        }`;

        const {
          data: { data: posts },
        } = await axios.get(url);

        const {
          data: { data: users },
        } = await axios.get(`${userBaseUrl}/users`);

        const mappedPosts = posts.map((post) =>
          PostController.#mapToModel(post, users),
        );

        if (!category) {
          await cacheService.set('posts', JSON.stringify(mappedPosts));
        }
        cachedPosts = mappedPosts;
      }

      res.status(200).json({
        statusCode: 200,
        data: cachedPosts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const {
        data: { data: post },
      } = await axios.get(`${appBaseUrl}/public/posts/${slug}`);

      const {
        data: { data: author },
      } = await axios.get(`${userBaseUrl}/users/${post.authorId}`);

      post.author = author;

      res.status(200).json({
        statusCode: 200,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  static async putPostById(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, imgUrl, categoryId, tags, authorId } = req.body;

      const { data: response } = await axios.put(`${appBaseUrl}/posts/${id}`, {
        title,
        content,
        imgUrl,
        categoryId,
        tags,
        authorId,
      });

      await cacheService.delete('posts');

      res.status(200).json({
        statusCode: 200,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePostById(req, res, next) {
    try {
      const { id } = req.params;

      const { data: response } = await axios.delete(
        `${appBaseUrl}/posts/${id}`,
      );

      await cacheService.delete('posts');

      res.status(200).json({
        statusCode: 200,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static #mapToModel(post, users) {
    return {
      ...post,
      author: users.find((user) => user.id === post.authorId),
    };
  }
}

module.exports = PostController;
