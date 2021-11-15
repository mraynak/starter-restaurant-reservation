const knex = require("../db/connection");

//list functions
function listByDate(date) {
    return knex("reservations")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .whereNot({"status": "cancelled"})
        .orderBy("reservation_time")
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )  
      .orderBy("reservation_date");
  }

//create function
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

//read function
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": reservation_id})
        .first()
}

//update functions
function updateRes(data) {
    return knex("reservations")
        .where({"reservation_id": data.reservation_id})
        .update(data)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

function update(id, status) {
    return knex("reservations")
        .where({"reservation_id": id})
        .update({"status": status})
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

module.exports = {
    read,
    listByDate,
    create,
    search,
    update,
    updateRes,
}