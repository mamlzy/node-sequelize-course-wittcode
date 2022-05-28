const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;
const bcrypt = require('bcrypt');
const zlib = require('zlib');

const sequelize = new Sequelize('node_sequelize', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
});

const User = sequelize.define(
  'user',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20],
      },
      // get() {
      //   const rawValue = this.getDataValue('username');
      //   return rawValue.toUpperCase();
      // },
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false,
      // set(value) {
      //   const salt = bcrypt.genSaltSync(12);
      //   const hash = bcrypt.hashSync(value, salt);

      //   this.setDataValue('password', hash);
      // },
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 17,
      validate: {
        // isOldEnough(value) {
        //   if (value < 17) {
        //     throw new Error('Too young!');
        //   }
        // },

        //! custom validation message
        isNumeric: {
          msg: 'Format harus nomor cuk',
        },
      },
    },
    desc: {
      type: DataTypes.STRING,
      // set(value) {
      //   const compressed = zlib.deflateSync(value).toString('base64');
      //   this.setDataValue('desc', compressed);
      // },
      // get() {
      //   const value = this.getDataValue('desc');
      //   const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'));

      //   return uncompressed.toString();
      // },
    },
    aboutUser: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.username} ${this.desc}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        // isEmail: true,
        // isIn: {
        //   args: [['test@gmail.com', 'hello@gmail.com', 'asd@gmail.com']],
        //   msg: 'Hanya email tertentu yang diizinkan!',
        // },
        myEmailValidator(value) {
          if (!value) {
            throw new Error('Email wajib diisi bro!');
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal(
        'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      ),
      field: 'updated_at',
    },
  },
  {
    validate: {
      usernamePassMatch() {
        if (this.username === this.password) {
          throw new Error('Password and Username gak boleh sama!');
        } else {
          console.log('passowrd and username ok.');
        }
      },
    },
    // timestamps: true,
    paranoid: true,
  }
);

function myFunction() {
  console.log('RUNNING SQL STATEMENT!');
}

User.sync()
  .then(() => {
    console.log('Table and Model synced successfully.');

    // return User.destroy({
    //   where: { id: 21 },
    //   // force: true,
    // });

    // return User.restore({ where: { id: 21 } });

    // return User.findOne({ where: { id: 21 } });
    return User.findOne({ where: { id: 21 }, paranoid: false });
  })
  .then((data) => {
    console.log('Success!');

    // const [result, metadata] = data;
    // console.log(result);
    // console.log(metadata);

    console.log(data);
    // console.log(data.toJSON());
    // data.map((element) => console.log(element.toJSON()));
  })
  .catch((err) => {
    console.log('Error when syncing the table and model! => ', err);
  });
