const Sequelize = require('sequelize')
const villainsModel = require('./villains')
const connection = new Sequelize('villain', 'Villains', 'catfish', {
  host: 'localhost', dialect: 'mysql'
})
const Villain = villainsModel(connection, Sequelize)

module.exports = { Villain }
