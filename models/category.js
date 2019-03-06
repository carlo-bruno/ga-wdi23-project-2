"use strict";
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
    "category",
    {
      name: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: function(category, options) {
          category.name = category.name.toLowerCase();
        }
      }
    }
  );
  category.associate = function(models) {
    // associations can be defined here
    models.category.belongsToMany(models.poem, {
      through: "categoriesPoems"
    });
  };
  return category;
};
