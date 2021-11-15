//makes sure the time given is correct
function validTime(time) {
    if (parseInt(time.slice(0, 2)) > 24 || parseInt(time.slice(0, 2)) < 0) return false
    if (time.slice(2, 3) !== ":") return false
    if (parseInt(time.slice(3, 5)) > 59) return false

    return true
}

module.exports = validTime