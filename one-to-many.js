const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('node_sequelize', 'root', '', {
  dialect: 'mysql',
});

const User = sequelize.define(
  'user',
  {
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Post = sequelize.define(
  'post',
  {
    message: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

//! User has many Posts
User.hasMany(Post, {
  onDelete: 'CASCADE',
});
Post.belongsTo(User, {
  onDelete: 'CASCADE',
});

let user, posts;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected succesfully.');

    return User.findOne();
  })
  .then((data) => {
    user = data;

    return Post.findOne();
  })
  .then((data) => {
    posts = data;

    return posts.setUser(user);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('Something went wrong... => ', err);
  });
