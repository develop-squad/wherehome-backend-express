const express = require('express')

const app = express()

app.use(express.json())

app.get('/api/test', async (req, res) => {
  res.sendStatus(200)
})

module.exports = app
