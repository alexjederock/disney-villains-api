const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.Villains.findAll({
      attributes: ['name', 'movie', 'slug']
    })

    return response.send(villains)
  } catch (error) {
    return response.status(500).send('Unable to get all villains, please try again')
  }
}

const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const villain = await models.Villains.findOne({
      where: { slug },
      attributes: ['name', 'movie', 'slug']
    })

    return villain
      ? response.send(villain)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to get villain, please try again')
  }
}

const saveNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.sendStatus(400)
    }
    const villain = await models.Villains.create({
      name, movie, slug
    })

    return response.status(201).send({ name, movie, slug })
  } catch (error) {
    return response.status(500).send('Unable to save villain, please try again')
  }
}

module.exports = { saveNewVillain, getVillainBySlug, getAllVillains }
