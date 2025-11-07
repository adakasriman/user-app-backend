const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email uniqueness
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',          // ✅ explicitly set table name
    timestamps: true,            // ✅ enables createdAt & updatedAt
    underscored: true,           // ✅ converts createdAt → created_at, updatedAt → updated_at
    freezeTableName: true,       // ✅ prevents Sequelize from pluralizing table name
});

module.exports = User;
