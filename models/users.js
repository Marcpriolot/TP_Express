const db = require('../db');
const Sequelize = require('sequelize');

const Users = db.define('users', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type : Sequelize.TEXT,
        unique:true
    },
    pwd : Sequelize.TEXT,
    createdAt : Sequelize.DATE,
    updatedAt : Sequelize.DATE
});

module.exports = Users;