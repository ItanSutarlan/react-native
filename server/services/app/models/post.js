'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
      this.hasMany(models.Tag, { foreignKey: 'postId', as: 'tags' });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title is required',
          },
          notEmpty: {
            msg: 'Title is required',
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Content is required',
          },
          notEmpty: {
            msg: 'Content is required',
          },
        },
      },
      imgUrl: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'categoryId is required',
          },
          notEmpty: {
            msg: 'categoryId is required',
          },
        },
      },
      authorId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'authorId is required',
          },
          notEmpty: {
            msg: 'authorId is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Post',
    },
  );
  Post.beforeCreate(async (post) => {
    post.slug = post.title.split(' ').join('-').toLowerCase();
  });
  Post.beforeUpdate(async (post) => {
    post.slug = post.title.split(' ').join('-').toLowerCase();
  });
  return Post;
};
