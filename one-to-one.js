const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('node_sequelize', 'root', '', {
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

//! set Country hasOne Capital
Country.hasOne(
  Capital,
  //! Optional object sebaiknya di pass juga ke foreign table nya
  {
    // foreignKey: {
    //   name: 'country_id',
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
);

//! and Capital belongsTo Country
Capital.belongsTo(Country);

let country, capital;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected succesfully.');

    return Country.findOne({ where: { countryName: 'Russia' } });
  })
  .then((data) => {
    country = data;

    return Capital.findOne({ where: { capitalName: 'Moskow' } });
  })
  .then((data) => {
    capital = data;

    return country.setCapital(capital);
  })
  .then((data) => {
    console.log('data => ', data.toJSON());
  })
  .catch((err) => {
    console.log('Database connection failed => ', err);
  });
