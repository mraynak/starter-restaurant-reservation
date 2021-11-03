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
  if(people === undefined || people <= 0 || !Number.isInteger(people)) {return next({status: 400, message: "Amount of people is missing or invalid"})}
  if (req.method === "POST") {
    if(status === "seated" || status === "finished") {return next({status: 400, message: `Status must be 'booked' or left out. ${status} status not valid`})}
  }
  return next()
}

module.exports = {
  list: [asyncErrorBoundary(dateQuery), asyncErrorBoundary(list)],
  create: [hasData, hasValidProperties, asyncErrorBoundary(create)],
};
