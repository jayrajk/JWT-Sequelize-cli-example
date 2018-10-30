'use strict';
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
      name: {
          type: DataTypes.STRING(50)
      },
      email: {
          type: DataTypes.STRING(50)
      },
      phone: {
          type: DataTypes.BIGINT()
      },
      password: {
          type: DataTypes.STRING(70)
      },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
  };
  User.prototype.safeModel = function() {
        return _.omit(this.toJSON(), ['password']);
  };

  return User;
};