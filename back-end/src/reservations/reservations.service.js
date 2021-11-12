const knex = require("../db/connection");

function listByDate(date) {
    return knex("reservations")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .whereNot({"status": "cancelled"})
        .orderBy("reservation_time")
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": reservation_id})
        .first()
}

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

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
    //   .where({"mobile_number": mobile_number})  
      .orderBy("reservation_date");
  }

module.exports = {
    read,
    listByDate,
    create,
    search,
    update,
    updateRes,
}