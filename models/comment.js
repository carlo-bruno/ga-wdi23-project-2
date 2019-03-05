"use strict";
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    "comment",
    {
      poemId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT
    },
    {}
  );
  comment.associate = function(models) {
    // associations can be defined here
    models.comment.belongsTo(models.user);
    models.comment.belongsTo(models.poem);
  };
  return comment;
};
