const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.use(express.json())

app.get('/api/test', async (req, res) => {
  res.sendStatus(200)
})

module.exports = app
