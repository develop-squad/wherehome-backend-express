const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.use(express.json())

app.get('/api/test', async (req, res) => {
  res.sendStatus(200)
})

app.get('/api/bus_stations', async (req, res) => {
  console.log('GET /api/bus_stations')

  const { pointX, pointY, radius } = req.query

  if (!pointX || !pointY) {
    res.status(400).json({
      status: 'error',
      error: 'query is empty',
    })
    return
  }

  try {
    const serviceKey = process.env.OPEN_API_KEY

    const { data } = await axios.get('http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos', {
      params: {
        serviceKey,
        tmX: pointX,
        tmY: pointY,
        radius: radius || 500,
        resultType: 'json',
      },
    })

    res.status(200).send(data.msgBody.itemList)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

module.exports = app
