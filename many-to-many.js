const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('node_sequelize', 'root', '', {
  dialect: 'mysql',
});

const Customer = sequelize.define(
  'customer',
  {
    customerName: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Product = sequelize.define(
  'product',
  {
    productName: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const CustomerProduct = sequelize.define(
  'customerproduct',
  {
    customerproductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

Customer.belongsToMany(Product, {
  through: CustomerProduct,
  // foreignKey: 'customer_id'
});
Product.belongsToMany(Customer, {
  through: CustomerProduct,
  // foreignKey: 'product_id'
});

let customer, product;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected succesfully.');

    return Product.findOne({ where: { productName: 'Laptop' } });
  })
  .then((data) => {
    product = data;

    return Customer.findAll();
  })
  .then((data) => {
    customer = data;

    return product.addCustomers(customer);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('Something went wrong... => ', err);
  });
