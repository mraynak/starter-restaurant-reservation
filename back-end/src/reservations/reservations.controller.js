const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const validTime = require("../errors/validTime")

//Handlers

//creates a new reservation
async function create(req, res) {
  const data = await reservationsService.create(req.body.data)
  res.status(201).json({ data: data })
}

//lists existing reservations given certian criteria
async function list(req, res) {
  res.json({data: res.locals.data})
}

//lists a single reservation based on reservation_id
function read(req, res) {
  res.json({data: res.locals.reservation})
}

//updates the status of a reservation
async function update(req, res, next) {
  const status = res.locals.status
  res.json({data: await reservationsService.update(res.locals.reservation.reservation_id, status )})
}

//updates any or all fields of a reservtion 
async function updateRes(req, res, next) {
  res.json({data: await reservationsService.updateRes(res.locals.data)})
}

//Validators

//given a number or date query sends errors if non existent or sets res.locals.data to aquired data given the query
async function dateQuery(req, res, next) {
  const {date, mobile_number} = req.query

  if(!date) {
    if(!mobile_number || mobile_number.length === 0) {return next({status: 400, message: "No phone number specified"})}
    const data = await reservationsService.search(mobile_number)

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

//confirms the request has data
function hasData(req, res, next) {
  const {data} = req.body
  if(!data) {
    return next({
      status: 400, 
      message: "Values should be in the 'data' section of the request body"
    })
  }
  return next()
}

//confirms the entered date has not passed 
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

//confirms the time is within the window to make reservations
function hasValidTime(req, res, next) {
  const {reservation_time} = res.locals
  if(reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservation time must be after 10:30am and before 9:30pm as we are close or time is too close to closing"
    })
  }
  return next()
}

//confirms the entered time has not already passed
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

//confirms the given day is not a Tuesday
function hasValidDay(req, res, next) {
  const {reservation_date} = res.locals
  const actualDay = new Date(reservation_date).getDay()
  if(actualDay + 1 === 2) {
    return next({
      status: 400,
      message: "Reservation day is invalid. The restuarant is closed on Tuesdays"
    })
  }
  next()
}

//confirms the fields in the given data are valid 
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

//confirms that the reservation exists givent the reservation_id
async function reservationExists(req, res, next) {
  const {reservation_id} = req.params
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

// confirms that the status is booked, seated, finished, or cancelled
function validStatus(req, res, next) {
  const {status} = req.body.data

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

//confirms the status is booked
function bookedStatus(req, res, next) {
  const {status} = req.body.data

  if(res.locals.reservation.status !== "booked") {
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
