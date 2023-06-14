const { Category, sequelize } = require('../models');

class CategoryController {
  static async postCategories(req, res, next) {
    try {
      const { name } = req.body;

      const result = await sequelize.transaction(async (t) => {
        const category = await Category.create(
          {
            name,
          },
          { transaction: t },
        );

        return category;
      });

      res.status(201).json({
        statusCode: 201,
        message: 'Category created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async putCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await sequelize.transaction(async (t) => {
        const categories = await Category.update(
          {
            name,
          },
          {
            where: {
              id,
            },
            transaction: t,
          },
        );

        if (!categories[0]) {
          throw { name: 'Data not found' };
        }
      });

      res.status(200).json({
        statusCode: 200,
        message: 'Category updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(_, res, next) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const categories = await Category.findAll({ transaction: t });

        return categories;
      });

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await sequelize.transaction(async (t) => {
        const category = await Category.findByPk(id, { transaction: t });

        if (!category) {
          throw { name: 'Data not found' };
        }
        return category;
      });

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (t) => {
        const category = await Category.destroy({
          where: {
            id,
          },
          transaction: t,
        });

        if (!category) {
          throw { name: 'Data not found' };
        }
      });

      res.status(200).json({
        statusCode: 200,
        message: `Category with id ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
