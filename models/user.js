"use strict";
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg:
              "Invalid name. Must be between 1 and 99 characters."
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg:
              "Invalid user name. Must be between 1 and 99 characters."
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8, 99],
            msg: "Password must be at least 8 characters."
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Invalid email address." }
        }
      }
    },
    {
      hooks: {
        beforeCreate: function(pendingUser, options) {
          if (pendingUser && pendingUser.password) {
            var hash = bcrypt.hashSync(pendingUser.password, 12);
            pendingUser.password = hash;
          }
        }
      }
    }
  );
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.poem);
    models.user.hasMany(models.comment);
  };
  // Function to compare entered password to hashed password
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };
  // Function to remove password before sending the user object
  user.prototype.toJSON = function() {
    var userData = this.get();
    delete userData.password;
    return userData;
  };
  return user;
};
