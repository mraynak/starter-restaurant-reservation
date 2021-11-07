const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

// ---------------------------------------------------------------------

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ "table_id": updatedTable.table_id})
        .update(updatedTable)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

function setStatus(id, status) {
    return knex("reservations")
        .where({"reservation_id": id})
        .update({"status": status})
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({"table_id": table_id})
        .first()
}

// ---------------------------------------------------------------------

module.exports = {
    list,
    create,
    read,
    update,
    setStatus,
}