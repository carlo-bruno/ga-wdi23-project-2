'use strict';
module.exports = (sequelize, DataTypes) => {
  const categoriesPoems = sequelize.define('categoriesPoems', {
    poemId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  categoriesPoems.associate = function(models) {
    // associations can be defined here
  };
  return categoriesPoems;
};