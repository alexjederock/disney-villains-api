const express = require('express')

const app = (express())

app.get('/villains', (request, response) => {})

app.listen(1337, () =>
{
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
