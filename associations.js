const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('node-sequelize', 'root', '', {
  dialect: 'mysql',
});

const Country = sequelize.define(
  'country',
  {
    countryName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Capital = sequelize.define(
  'capital',
  {
    capitalName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);
