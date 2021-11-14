import React from "react"
import {setStatus} from "../utils/api"

import "./Reservation.css";

function Reservation({reservations, loadDashboard}) {
    
    const cards = reservations.map((reservation) => {
        function cancelReservation(event) {
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

        function coloredText(status) {
            if(status === "booked") {
                return <span className="text-primary font-weight-bold">{status}</span>
            }
            if(status === "seated") {
                return <span className="text-secondary font-weight-bold">{status}</span>
            }
            if(status === "cancelled") {
                return <span className="text-danger font-weight-bold">{status}</span>
            }
            if(status === "finished") {
                return <span className="text-success font-weight-bold">{status}</span>
            }
        }
        
        const reservation_id = reservation.reservation_id
        return (
            <div className="card m-2" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Reservation Date: {reservation.reservation_date}<br />
                    Reservation Time: {reservation.reservation_time}<br />
                    Amount of People: {reservation.people}</p>
                    <p className="card-text" data-reservation-id-status={reservation.reservation_id} >Status: {coloredText(reservation.status)}</p>
                    <div>
                    {reservation.status === "booked" ? <a href={`/reservations/${reservation_id}/seat`}><button type="submit" className="btn btn-primary m-2">Seat</button></a> : null}
                    <a href={`/reservations/${reservation_id}/edit`}><button type="Edit" className="btn btn-secondary">Edit</button></a>
                    <button type="Cancel" className="btn btn-danger m-2" data-reservation-id-cancel={reservation.reservation_id} onClick={cancelReservation}>Cancel</button>
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