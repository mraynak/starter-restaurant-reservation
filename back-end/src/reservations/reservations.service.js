const knex = require("../db/connection");

function listByDate(date) {
    return knex("reservations")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .orderBy("reservation_time")
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

module.exports = {
    listByDate,
    create,
}