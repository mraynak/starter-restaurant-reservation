const tablesService = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//Handlers

async function list(req, res, next) {
    const data = await tablesService.list()
    res.json({data: data})
}

async function create(req, res) {
    res.status(201).json({ data: await tablesService.create(res.locals.data) })
  }

//   ---------------------------------------------------------------------

async function update(req, res, next) {
    const updatedTable = {
        table_id: res.locals.table_id,
        table_name: res.locals.tableData.table_name,
        capacity: res.locals.tableData.capacity,
        reservation_id: res.locals.reservation_id,
        occupied: true
    }
    await tablesService.setStatus(res.locals.reservation_id, "seated")
    res.json({data: await tablesService.update(updatedTable)})
}

  
//Validators

function hasData(req, res, next) {
    const {data} = req.body
  
    if(!data) {
      return next({
        status: 400, 
        message: "Values should be in the 'data' section of the request body"
      })
    }
    res.locals.data = data
    return next()
  }

  function hasValidProperties(req, res, next) {
    const {table_name, capacity} = res.locals.data
    
    if(!table_name || table_name.length === 0) {
        return next({status: 400, message: "table_name is required for reservation"})
    }
    if(!capacity || capacity <= 0) {
        return next({status: 400, message: "Table capacity is missing or invalid"})
    }
    return next()
  }

//   ---------------------------------------------------------------------

  async function reservationExists(req, res, next) {
    const data = await reservationsService.read(res.locals.data.reservation_id)

    if (!data || data.length === 0) {
        return next({
            status: 404,
            message: `Reservation ${res.locals.data.reservation_id} could not be found`
        })
    }
    res.locals.data = data
    return next()
  }

  function putRequestValidProperties(req, res, next) {
      const {reservation_id} = res.locals.data
      if(!reservation_id || reservation_id <= 0) {
          return next({
              status: 400,
              message: "The reservation_id property is missing or invalid"
          })
      }
      res.locals.reservation_id = reservation_id
      return next()
  }

  async function tableExists(req, res, next) {
      const {table_id} = req.params
      const data = await tablesService.read(table_id)

      if(!data || data.length === 0) {
          return next ({
              status: 404,
              message: `Table ${table_id} not found`
          })
      }
      res.locals.tableData = data
      res.locals.table_id = table_id
      return next()
  }

  function hasCapacity(req, res, next) {
      if(res.locals.tableData.capacity < res.locals.data.people) {
          return next ({
              status: 400,
              message: "Table does not have enough capacity"
          })
      }
      if(res.locals.tableData.reservation_id !==null) ({
          status: 400,
          message: "Table is already occupied"
      })
      return next()
  }

  function isNotSeated(req, res, next) {
      if(res.locals.data.status === "seated") {
        return next({
            status: 400,
            message: "Reservation is already seated"
        })
      }
      return next()
  }

  function isOccupied(req, res, next) {
      if(res.locals.tableData.occupied = true) {
          return next({
              status: 400,
              message: `Table ${res.locals.tableData.table_name} is already occupied`
          })
      }
      return next()
  }

  module.exports = {
      list: [asyncErrorBoundary(list)],
      create: [hasData, hasValidProperties, asyncErrorBoundary(create)],
      update: [hasData, putRequestValidProperties, asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), hasCapacity, isNotSeated, isOccupied, asyncErrorBoundary(update)]
  }