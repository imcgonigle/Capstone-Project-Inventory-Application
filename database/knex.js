var enviroment = 'development';
var config = require('../knexfile')[enviroment];

module.exports = require('knex')(config);
