const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const validTime = require("../errors/validTime")

//Handlers

async function create(req, res) {
  const data = await reservationsService.create(req.body.data)
  res.status(201).json({ data: data })
}
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  // console.log(res.locals.data)
  res.json({data: res.locals.data})
}

function read(req, res) {
  res.json({data: res.locals.reservation})
}

async function update(req, res, next) {
  const status = res.locals.status
  // console.log(status)
  res.json({data: await reservationsService.update(res.locals.reservation.reservation_id, status )})
}

async function updateRes(req, res, next) {
  res.json({data: await reservationsService.updateRes(res.locals.data)})
}

//Validators

async function dateQuery(req, res, next) {
  const {date, mobile_number} = req.query
  console.log(mobile_number)

  if(!date) {
    if(!mobile_number || mobile_number.length === 0) {return next({status: 400, message: "No phone number specified"})}
    const data = await reservationsService.search(mobile_number)
    // if(!data || data.length === 0) {return next({status: 404, message: "No reservations found"})}

    res.locals.data = data
  }

  if(!mobile_number) {
    let dateValue = Date.parse(date)

    if(!date || date.length === 0) {return next({status: 400, message:"No date value specified"})}
    if(!dateValue) {return next({status: 400, message: "Given date is invalid"})}

    const data = await reservationsService.listByDate(date)
    if(!data || data.length === 0) {return next({status: 404, message: "No reservations for given date"})}

    res.locals.data = data
  }
  return next()
}

function hasData(req, res, next) {
  const {data} = req.body
  console.log(data)
  if(!data) {
    return next({
      status: 400, 
      message: "Values should be in the 'data' section of the request body"
    })
  }
  return next()
}

function hasValidDate(req, res, next) {
  const {reservation_date} = res.locals
  if((Date.parse(reservation_date) + 77400000) < Date.now() - 25200000) {
    return next({
      status: 400,
      message: "Selected reservation date has already passed, date must be today or in the future"
    })
  }
  return next()
}

function hasValidTime(req, res, next) {
  const {reservation_time} = res.locals
  console.log(typeof reservation_time)
  if(reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservation time must be after 10:30am and before 9:30pm as we are close or time is too close to closing"
    })
  }
  return next()
}
function timeNotPassed(req, res, next) {
  const {reservation_time, reservation_date} = res.locals
  const parseTime = Date.parse(reservation_date)
  const resTimeOfDay = (Number(reservation_time.substring(0,2) * 60) + Number(reservation_time.substring(3))) * 60000
  const resTime = (resTimeOfDay + parseTime)
  const time = Date.now() - 25200000
  if(resTime < time) {
      return next({
          message: `Selected reservation time has already passed, time must be today or in the future`
      })
  }
  next()
}

function hasValidDay(req, res, next) {
  const {reservation_date} = res.locals
  const actualDay = new Date(reservation_date).getDay()
  // console.log(actualDay)
  if(actualDay + 1 === 2) {
    return next({
      status: 400,
      message: "Reservation day is invalid. The restuarant is closed on Tuesdays"
    })
  }
  next()
}

function hasValidProperties(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = req.body.data
  const reservationDate = new Date(reservation_date)
  console.log(req.body.data)
  

  if(!first_name || first_name.length === 0) {return next({status: 400, message: "first_name is required for reservation"})}
  if(!last_name || last_name.length === 0) {return next({status: 400, message: "last_name is required for reservation"})}
  if(!mobile_number || mobile_number.length === 0) {return next({status: 400, message: "mobile_number is required for reservation"})}
  if(!reservation_date || reservation_date.length === 0 || !reservationDate.getTime()) {return next({status: 400, message: "reservation_date is required for reservation"})}
  if(!reservation_time || reservation_time.length === 0 || !validTime(reservation_time)) {return next({status: 400, message: "reservation_time is required for reservation"})}
  if(!people || people <= 0 || !Number.isInteger(people)) {return next({status: 400, message: "Amount of people is missing or invalid"})}
  if (req.method === "POST") {
    if(status === "seated" || status === "finished" || status === "cancelled") {return next({status: 400, message: `Status must be 'booked' or left out. ${status} status not valid`})}
  }

  if (req.method === "POST") {
    res.locals = {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
      status: status,
    }
  }
  if (req.method === "PUT" && req.path === `/${res.locals.reservation.reservation_id}`) {
    res.locals.data = {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
      status: status,
      reservation_id: res.locals.reservation.reservation_id
    }
  }

  return next()
}

async function reservationExists(req, res, next) {
  const {reservation_id} = req.params
  console.log(reservation_id)
  const reservation = await reservationsService.read(reservation_id)

  if(reservation) {
    res.locals.reservation = reservation
    return next()
  }
  return next({
    status: 404, 
    message: `Reservation ${reservation_id} cannot be found`
  })
}

const VALID_STATUS = [
  "booked", 
  "seated",
  "finished",
  "cancelled"
]
function validStatus(req, res, next) {
  const {status} = req.body.data
  console.log(status)

  if(!VALID_STATUS.includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: ${status}`
    })
  }
  if(res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished and cannot be updated"
    })
  }
  res.locals.status = status
  return next()
}

function bookedStatus(req, res, next) {
  const {status} = req.body.data
  console.log(status)

  if(status !== "booked") {
    return next({
      status: 400,
      message: `Reservtions with status ${status} cannot be edited`
    })
  }
  res.locals.status = status
  return next()
}

module.exports = {
  list: [asyncErrorBoundary(dateQuery), asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), hasData, validStatus, asyncErrorBoundary(update)],
  updateRes: [asyncErrorBoundary(reservationExists), hasData, hasValidProperties, bookedStatus, asyncErrorBoundary(updateRes)],
  create: [hasData, hasValidProperties, hasValidDate, hasValidTime, hasValidDay, timeNotPassed, asyncErrorBoundary(create)],
};
