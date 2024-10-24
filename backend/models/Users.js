module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING, // URL of the avatar
      allowNull: true,
    },
    avatarPath: {
      type: DataTypes.STRING, // Path of the avatar
      allowNull: true,
    },
  });

  return Users;
};

