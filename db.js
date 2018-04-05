const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = new Sequelize('db', 'user', 'pwd', {
    host:'localhost',
    dialect: 'sqlite',
    storage:'todo.sqlite',
    operatorAliases :Op
});

module.exports = db;