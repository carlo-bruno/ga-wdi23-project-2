"use strict";
module.exports = (sequelize, DataTypes) => {
  const poem = sequelize.define(
    "poem",
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      isPublished: DataTypes.BOOLEAN,
      hearts: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {}
  );
  poem.associate = function(models) {
    // associations can be defined here
    models.poem.belongsTo(models.user);
    models.poem.hasMany(models.comment);
    models.poem.belongsToMany(models.category, {
      through: "categoriesPoems"
    });
  };
  return poem;
};
