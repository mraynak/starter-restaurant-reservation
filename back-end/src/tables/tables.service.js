const knex = require("../db/connection")

//list function
function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

// create table function
function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

//update a table when seated or finished
function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ "table_id": updatedTable.table_id})
        .update(updatedTable)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
}

//reads table to confirm it exists
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({"table_id": table_id})
        .first()
}

//reservation function to set status when seated or finished
function setStatus(id, status) {
    return knex("reservations")
        .where({"reservation_id": id})
        .update({"status": status})
}

module.exports = {
    list,
    create,
    read,
    update,
    setStatus,
}