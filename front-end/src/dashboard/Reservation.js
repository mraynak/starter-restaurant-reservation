import React from "react"

function Reservation({reservations}) {
    const cards = reservations.map((reservation) => {
        const reservation_id = reservation.reservation_id
        return (
            <div className="card" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Reservation Date: {reservation.reservation_date}<br />
                    Reservation Time: {reservation.reservation_time}<br />
                    Amount of People: {reservation.people}</p>
                    <a href={`/reservations/${reservation_id}/seat`} className="btn btn primary">Seat</a>
                </div>
            </div>
        )
    })
    return (
        <>
            {cards}
        </>
    )
}

export default Reservation