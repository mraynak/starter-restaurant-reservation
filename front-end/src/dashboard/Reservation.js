import React from "react"
import {setStatus} from "../utils/api"

function Reservation({reservations, loadDashboard}) {
    
    const cards = reservations.map((reservation) => {
        function cancelReservation(event) {
            console.log(reservation.reservation_id)
            event.preventDefault()
    
            const abortController = new AbortController()
    
            if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
                const data = {
                    reservation_id: reservation.reservation_id,
                    status: "cancelled"
                }
                
                setStatus(data, reservation.reservation_id, abortController.signal)
                    .then(loadDashboard)
            }
        }
        const reservation_id = reservation.reservation_id
        return (
            <div className="card" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Reservation Date: {reservation.reservation_date}<br />
                    Reservation Time: {reservation.reservation_time}<br />
                    Amount of People: {reservation.people}</p>
                    <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
                    <div>
                    {reservation.status === "booked" ? <a href={`/reservations/${reservation_id}/seat`} className="btn btn primary"><button type="submit" className="btn btn-primary p-1">Seat</button></a> : null}
                    <a href={`/reservations/${reservation_id}/edit`} className="btn btn primary"><button type="Edit" className="btn btn-secondary p-1">Edit</button></a>
                    <button type="Cancel" className="btn btn-danger p-1" data-reservation-id-cancel={reservation.reservation_id} onClick={cancelReservation}>Cancel</button>
                    </div>
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