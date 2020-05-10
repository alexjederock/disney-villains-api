const express = require('express')
const parser = require('body-parser')
const { saveNewVillain, getVillainBySlug, getAllVillains } = require('./controllers/villains')

const app = (express())

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', parser.json(), saveNewVillain)

app.listen(1337, () =>
{
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
