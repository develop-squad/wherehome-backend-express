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
      },
    })

    const refinedData = data.split('</msgHeader>').pop()

    const dataJSON = refinedData
      .split('</itemList>')
      .map((str) => {
        if (
          ['arsId', 'dist', 'gpsX', 'gpsY', 'posX', 'posY', 'stationId', 'stationNm', 'stationTp']
            .map((key) => str.includes(key))
            .findIndex((isIncludes) => !isIncludes) !== -1
        ) {
          return null
        }

        const arsId = str.split('<arsId>').pop().split('</arsId>')[0]
        const dist = str.split('<dist>').pop().split('</dist>')[0]
        const gpsX = str.split('<gpsX>').pop().split('</gpsX>')[0]
        const gpsY = str.split('<gpsY>').pop().split('</gpsY>')[0]
        const posX = str.split('<posX>').pop().split('</posX>')[0]
        const posY = str.split('<posY>').pop().split('</posY>')[0]
        const stationId = str.split('<stationId>').pop().split('</stationId>')[0]
        const stationNm = str.split('<stationNm>').pop().split('</stationNm>')[0]
        const stationTp = str.split('<stationTp>').pop().split('</stationTp>')[0]

        return {
          arsId,
          dist,
          gpsX,
          gpsY,
          posX,
          posY,
          stationId,
          stationNm,
          stationTp,
        }
      })
      .filter((station) => station)

    res.status(200).send(dataJSON)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

module.exports = app
