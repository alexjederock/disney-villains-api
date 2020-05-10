const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.Villains.findAll({
    attributes: ['name', 'movie', 'slug']
  })

  return response.send(villains)
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const villain = await models.Villains.findOne({
    where: { slug },
    attributes: ['name', 'movie', 'slug']
  })

  return villain
    ? response.send(villain)
    : response.sendStatus(404)
}

const saveNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  const villain = await models.Villains.create({
    name, movie, slug
  })

  if (!name || !movie || !slug) {
    return response.sendStatus(400)
  }

  return response.status(201).send({ name, movie, slug })
}

module.exports = { saveNewVillain, getVillainBySlug, getAllVillains }
