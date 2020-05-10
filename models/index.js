const Sequelize = require('sequelize')
const villainsModel = require('./villains')
const connection = new Sequelize('villains', 'villains', 'catfish', {
  host: 'localhost', dialect: 'mysql'
})
const Villains = villainsModel(connection, Sequelize)

module.exports = { Villains }
