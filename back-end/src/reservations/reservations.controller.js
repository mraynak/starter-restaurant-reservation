const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//Handlers

async function create(req, res) {
  const data = await reservationsService.create(req.body.data)
  res.status(201).json({ data: data })
}
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({data: res.locals.data})
}

//Validators

async function dateQuery(req, res, next) {
  const {date} = req.query
  let dateValue = Date.parse(date)

  if(!date || date.length === 0) {return next({status: 400, message:"No date value specified"})}
  if(!dateValue) {return next({status: 400, message: "Given date is invalid"})}

  const data = await reservationsService.listByDate(date)
  if(!data || data.length === 0) {return next({status: 404, message: "No reservations for given date"})}

  res.locals.data = data
  return next()
}

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

function hasValidDate(req, res, next) {
  const {reservation_date} = res.locals
  if(Date.parse(reservation_date) < Date.now()) {
    return next({
      status: 400,
      message: "Selected reservation date has already passed, date must be today or in the future"
    })
  }
  return next()
}

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

function hasValidDay(req, res, next) {
  const {reservation_date} = res.locals
  const actualDay = new Date(reservation_date).getDay()
  console.log(actualDay)
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
    status = "booked"
  } = req.body.data
  const reservationDate = new Date(reservation_date)

  if(!first_name || first_name.length === 0) {return next({status: 400, message: "First name is required for reservation"})}
  if(!last_name || last_name.length === 0) {return next({status: 400, message: "Last name is required for reservation"})}
  if(!mobile_number || mobile_number.length === 0) {return next({status: 400, message: "Mobile Number is required for reservation"})}
  if(!reservation_date || reservation_date.length === 0 || !reservationDate.getTime()) {return next({status: 400, message: "Reservation date is required for reservation"})}
  if(!reservation_time || reservation_time.length === 0) {return next({status: 400, message: "Reservation time is required for reservation"})}
  if(!people || people <= 0) {return next({status: 400, message: "Amount of people is missing or invalid"})}
  if (req.method === "POST") {
    if(status === "seated" || status === "finished") {return next({status: 400, message: `Status must be 'booked' or left out. ${status} status not valid`})}
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

  return next()
}

module.exports = {
  list: [asyncErrorBoundary(dateQuery), asyncErrorBoundary(list)],
  create: [hasData, hasValidProperties, hasValidDate, hasValidTime, hasValidDay, asyncErrorBoundary(create)],
};
