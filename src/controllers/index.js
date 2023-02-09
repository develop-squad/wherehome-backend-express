const axios = require('axios')
const {
  GET_STATION_BY_POS_LINK,
  GET_ROUTE_BY_STATION_LINK,
  GET_STATION_BY_ROUTE_LINK,
} = require('../helpers/constants')

exports.getBusStationsByPosition = async (req, res) => {
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

    const { data } = await axios.get(GET_STATION_BY_POS_LINK, {
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
}

exports.getBusRoutes = async (req, res) => {
  console.log('GET /api/bus_routes')

  const { stationIds } = req.query

  if (!stationIds) {
    res.status(400).json({
      status: 'error',
      error: 'query is empty',
    })
    return
  }

  const getAllBusRoutes = async (stationIdList) => {
    const serviceKey = process.env.OPEN_API_KEY

    const routes = await Promise.all(
      stationIdList.map(async (arsId) => {
        try {
          const { data } = await axios.get(GET_ROUTE_BY_STATION_LINK, {
            params: {
              serviceKey,
              arsId,
              resultType: 'json',
            },
          })

          if (!data) return { arsId, status: 'error' }

          return { arsId, busRoutes: data.msgBody.itemList || [] }
        } catch (error) {
          return { arsId, status: 'error' }
        }
      })
    )

    return routes
  }

  try {
    const response = await getAllBusRoutes(stationIds.split(','))

    res.status(200).send(response)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

exports.getBusStationsByRoute = async (req, res) => {
  console.log('GET /api/bus_route_paths')

  const { busRouteId } = req.query

  if (!busRouteId) {
    res.status(400).json({
      status: 'error',
      error: 'query is empty',
    })
    return
  }

  try {
    const serviceKey = process.env.OPEN_API_KEY

    const { data } = await axios.get(GET_STATION_BY_ROUTE_LINK, {
      params: {
        serviceKey,
        busRouteId,
        resultType: 'json',
      },
    })

    res.status(200).send(data.msgBody.itemList)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}
