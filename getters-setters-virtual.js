const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;
const bcrypt = require('bcrypt');
const zlib = require('zlib');

const sequelize = new Sequelize('node_sequelize', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
});

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 20],
    },
    get() {
      const rawValue = this.getDataValue('username');
      return rawValue.toUpperCase();
    },
  },
  password: {
    type: DataTypes.STRING,
    // allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(value, salt);

      this.setDataValue('password', hash);
    },
  },
  age: {
    type: DataTypes.INTEGER,
    defaultValue: 17,
  },
  desc: {
    type: DataTypes.STRING,
    set(value) {
      const compressed = zlib.deflateSync(value).toString('base64');
      this.setDataValue('desc', compressed);
    },
    get() {
      const value = this.getDataValue('desc');
      const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'));

      return uncompressed.toString();
    },
  },
  aboutUser: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.username} ${this.desc}`;
    },
  },
});

User.sync({ alter: true })
  .then(() => {
    console.log('Table and Model synced successfully.');

    return User.findOne({ where: { username: 'Tara' } });
  })
  .then((data) => {
    console.log('Success!');

    // console.log(data.username);
    // console.log(data.password);
    // console.log(data.desc);
    console.log(data.aboutUser);
    // console.log(data.toJSON());
  })
  .catch((err) => {
    console.log('Error when syncing the table and model! => ', err);
  });

// sequelize
//   .authenticate()
//   .then(() => console.log('Connection Succesfull'))
//   .catch((err) => console.log('Error connection to database!'));
