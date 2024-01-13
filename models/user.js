"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async register({ displayName, email, password }) {
      return await this.create({
        displayName,
        email,
        password,
        isVerified: false,
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      displayName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      channelId: DataTypes.STRING,
      emailVerificationToken: DataTypes.STRING,
      emailVerificationTokenExpiresAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetTokenExpiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
