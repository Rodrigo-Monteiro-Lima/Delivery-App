const { literal } = require('sequelize');
const { validateNewSale } = require('./validations/validationsInputValues');
const { Sale, Product, SalesProduct, sequelize, User } = require('../database/models');

const query = '`products->SalesProduct`.`quantity`';

const getSaleById = async (id, t) => {
  const sale = await Sale.findByPk(
    id,
    {
      include: {
        model: Product,
        as: 'products',
        through: { attributes: [] },
        attributes: ['id', 'name', 'price', 'urlImage',
          [literal(query), 'quantity']],
      },
      transaction: t,
    },
  );
  return sale;
};

const create = async (sale) => {
  const error = validateNewSale(sale);
  if (error) return error;
  try {
    const result = await sequelize.transaction(async (t) => {
      const newSale = (await Sale.create({ ...sale }, { transaction: t }))
        .get({ plain: true });
      await Promise.all(sale.cart.map(async ({ productId, quantity }) => SalesProduct
        .create({ saleId: newSale.id, productId, quantity }, { transaction: t })));
      const saleById = getSaleById(newSale.id, t);
      return saleById;
    });
    return { status: 201, sale: result };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCustomerSales = async (id) => {
  const userExists = await User.findByPk(id, { raw: true });
  if (!userExists || userExists.role !== 'customer') {
    return { status: 404, message: 'Customer not found!' };
  }
  const sales = await Sale.findAll({
    where: { userId: id },
    include: {
      model: Product,
      as: 'products',
      through: {
        attributes: [],
      },
      attributes: ['id', 'name', 'price', 'urlImage',
        [literal(query), 'quantity']],
    },
  });
  return sales;
};

const getSellerSales = async (id) => {
  const userExists = await User.findByPk(id, { raw: true });
  if (!userExists || userExists.role !== 'seller') {
    return { status: 404, message: 'Seller not found!' };
  }
  const sales = await Sale.findAll({
    where: { sellerId: id },
    include: {
      model: Product,
      as: 'products',
      through: {
        attributes: [],
      },
      attributes: ['id', 'name', 'price', 'urlImage',
        [literal(query), 'quantity']],
    },
  });
  return sales;
};

const updateStatus = async (id, status) => {
  const sale = await Sale.findByPk(id);
  if (!sale) return { status: 404, message: 'Sale not found' };
  if (sale.status === 'Delivered') return { status: 422, message: 'Sale already delivered' };
  if (!['In Transit', 'Preparing', 'Delivered'].includes(status)) {
    return {
      status: 400,
      message: 'Invalid status, status should be "In Transit", "Preparing" or "Delivered"',
    };
  }
  await Sale.update({ status }, { where: { id } });
};

module.exports = {
  create,
  getCustomerSales,
  getSellerSales,
  updateStatus,
};
