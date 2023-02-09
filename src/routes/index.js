const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

const controller = require('../controllers')

app.get('/api/test', async (req, res) => {
  res.sendStatus(200)
})

app.get('/api/bus_stations', controller.getBusStationsByPosition)

app.get('/api/bus_routes', controller.getBusRoutes)

app.get('/api/bus_stations_by_route', controller.getBusStationsByRoute)

module.exports = app
