module.exports = (sequelize, datatypes) => {
    const Posts = sequelize.define("Posts", {
      title: {
        type: datatypes.STRING,
        allowNull: false,
      },
      postText: {
        type: datatypes.STRING,
        allowNull: false,
      },
      username: {
        type: datatypes.STRING,
        allowNull: false,
      },
    });

    return Posts
}