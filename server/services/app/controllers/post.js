const { Op } = require('sequelize');
const { Post, Tag, Category, sequelize } = require('../models');

class PostController {
  static async postPost(req, res, next) {
    try {
      let { title, content, imgUrl, categoryId, tags, authorId } = req.body;
      const result = await sequelize.transaction(async (t) => {
        const post = await Post.create(
          {
            title,
            content,
            imgUrl,
            categoryId: +categoryId,
            authorId,
          },
          { transaction: t },
        );

        tags = tags.map((tag) => ({ name: tag, postId: post.id }));

        const newTags = await Tag.bulkCreate(tags, { transaction: t });

        return {
          ...post.toJSON(),
          tags: newTags,
        };
      });

      res.status(201).json({
        statusCode: 201,
        message: 'post created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(req, res, next) {
    try {
      const { category } = req.query;
      const result = await sequelize.transaction(async (t) => {
        const paramQuerySQL = {
          include: [
            {
              model: Category,
              as: 'category',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: Tag,
              as: 'tags',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          transaction: t,
        };

        if (category !== '' && typeof category !== 'undefined') {
          const query = category.split(',').map((item) => ({
            [Op.eq]: item,
          }));

          paramQuerySQL.where = {
            categoryId: { [Op.or]: query },
          };
        }

        const posts = await Post.findAll(paramQuerySQL);

        return posts;
      });

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const result = await sequelize.transaction(async (t) => {
        const post = await Post.findOne({
          include: [
            {
              model: Category,
              as: 'category',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: Tag,
              as: 'tags',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          where: {
            slug,
          },
          transaction: t,
        });

        if (!post) {
          throw { name: 'Data not found' };
        }

        return post;
      });

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await sequelize.transaction(async (t) => {
        const post = await Post.findOne({
          include: {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
          where: {
            id,
          },
          transaction: t,
        });

        if (!post) {
          throw { name: 'Data not found' };
        }

        return post;
      });

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async putPostById(req, res, next) {
    try {
      const { id } = req.params;
      let { title, content, imgUrl, categoryId, tags } = req.body;

      await sequelize.transaction(async (t) => {
        const post = await Post.update(
          {
            title,
            content,
            imgUrl,
            categoryId,
          },
          {
            where: {
              id,
            },
            transaction: t,
            individualHooks: true,
          },
        );

        if (!post[0]) {
          throw { name: 'Data not found' };
        }

        tags = tags.map((tag) => ({ name: tag, postId: id }));

        await Tag.destroy({
          where: {
            postId: id,
          },
          transaction: t,
        });

        await Tag.bulkCreate(tags, {
          transaction: t,
        });

        return;
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Post updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePostById(req, res, next) {
    try {
      const { id } = req.params;

      await sequelize.transaction(async (t) => {
        const post = await Post.destroy({
          where: {
            id,
          },
          transaction: t,
        });

        if (!post) {
          throw { name: 'Data not found' };
        }

        return;
      });

      res.status(200).json({
        statusCode: 200,
        message: `Post with id ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
