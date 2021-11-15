const tablesService = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


//Handlers

//lists all tables
async function list(req, res, next) {
    const data = await tablesService.list()
    res.json({data: data})
}

// creates a new table
async function create(req, res) {
    res.status(201).json({ data: await tablesService.create(res.locals.data) })
  }

//updates the table occupied status to true and sets reservation to seated
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

//updates the table occupied status to false and sets reservation_id for the table to null
async function destroy(req, res, next) {
    const data = {
        table_id: res.locals.table_id,
        table_name: res.locals.tableData.table_name,
        capacity: res.locals.tableData.capacity,
        reservation_id: null,
        occupied: false
    }
    res.json({data: await tablesService.update(data)})
}

  
//Validators

//confirms that request has data
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

//confirms that the fields for the given data for a new table are valid
function hasValidProperties(req, res, next) {
    const {table_name, capacity, reservation_id} = res.locals.data
    
    if(!table_name || !table_name.length || table_name.length < 2) {
        return next({status: 400, message: "table_name is required for reservation"})
    }
    if(!capacity || capacity === 0 || !Number.isInteger(capacity)) {
        return next({status: 400, message: "Table capacity is missing or invalid"})
    }
    if(reservation_id) {
        const table = {
            table_name: table_name,
            capacity: capacity,
            reservation_id: reservation_id,
            occupied: true,
        }
        res.locals.data = table
    }
    
    return next()
  }

//confirms that reservation being added to the tables table exists
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

//confirms that a reservtion_id is in the request
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

// confirms that the table being sat exists
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

//confirms that the table has a large enough capacity to fit the reservation
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

// confirms that the table is not already seated
function isNotSeated(req, res, next) {
    if(res.locals.data.status === "seated") {
        return next({
            status: 400,
            message: "Reservation is already seated"
        })
      }
    return next()
  }

//confirms that the table is not occupied when seating
function isOccupied(req, res, next) {
    if(res.locals.tableData.occupied) {
        return next({
            status: 400,
            message: `Table ${res.locals.tableData.table_name} is already occupied`
          })
      }
    return next()
  }

//confirms that the table is occupieed when finishing a reservation
async function isNotOccupied(req, res, next) {
    if(!res.locals.tableData.occupied) {
        return next({
            status: 400,
            message: `Table ${res.locals.tableData.table_name} is not occupied`
        })
    }
    await tablesService.setStatus(res.locals.tableData.reservation_id, "finished")
    return next()
}

  module.exports = {
      list: [asyncErrorBoundary(list)],
      create: [hasData, hasValidProperties, asyncErrorBoundary(create)],
      destroy: [asyncErrorBoundary(tableExists), asyncErrorBoundary(isNotOccupied), asyncErrorBoundary(destroy)],
      update: [hasData, putRequestValidProperties, asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), hasCapacity, isNotSeated, isOccupied, asyncErrorBoundary(update)]
  }