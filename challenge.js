const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('node_sequelize', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
});

const Student = sequelize.define(
  'student',
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20],
      },
    },
    favorite_class: {
      type: DataTypes.STRING(25),
      defaultValue: 'Computer Science',
    },
    school_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }
  // {
  //   timestamps: false,
  // }
);

Student.sync({ alter: true })
  .then(() => {
    console.log('Table and Model synced successfully.');

    //! Challenge #1
    // return Student.findAll({
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   where: {
    //     [Op.or]: { favorite_class: 'Computer Science', subscribed: true },
    //   },
    // });

    //! Challenge #2
    return Student.findAll({
      attributes: [
        'school_year',
        [sequelize.fn('COUNT', sequelize.col('school_year')), 'num_students'],
      ],
      group: 'school_year',
    });

    // return Student.
  })
  .then((data) => {
    console.log('Success!');
    // console.log(data);
    data.map((element) => console.log(element.toJSON()));
  })
  .catch((err) => {
    console.log('Error when syncing the table and model! => ', err);
  });

// sequelize
//   .authenticate()
//   .then(() => console.log('Connection Succesfull'))
//   .catch((err) => console.log('Error connection to database!'));
