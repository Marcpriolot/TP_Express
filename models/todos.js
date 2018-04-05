const db = require('../db');
const Sequelize = require('sequelize');

const Todos = db.define('todos', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId : Sequelize.INTEGER,
    message : Sequelize.TEXT,
    completion : Sequelize.BOOLEAN,
    createdAt : Sequelize.DATE,
    updatedAt : Sequelize.DATE
});

module.exports = Todos;