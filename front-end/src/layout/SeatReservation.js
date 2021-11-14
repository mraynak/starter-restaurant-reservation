import React, {useState, useEffect} from "react"
import { listTables, readReservation, seatReservation, setStatus} from "../utils/api"
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "./ErrorAlert"

function SeatReservation() {
    const [tables, setTables] = useState([])
    const [reservation, setReservation] = useState([])
    const [errors, setErrors] = useState(null)
    const [reservationError, setReservationError] = useState(null)
    const history = useHistory()
    const {reservation_id} = useParams()

    useEffect(loadTablesAndReservation, [reservation_id])

    function loadTablesAndReservation() {
        const abortController = new AbortController()
        setReservationError(null)
        readReservation(reservation_id)
            .then(setReservation)
            .catch(setReservationError)
        listTables(abortController.signal)
            .then(setTables)
            .catch(setErrors)
        return () => abortController.abort();
    }

    async function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        setErrors(null)

        const select = document.querySelector('select')
        const selectedId = select.options[select.selectedIndex].id

        try {
            await seatReservation(reservation_id, selectedId, abortController.signal)
            const data = {
                reservation_id: reservation_id,
                status: "seated"
            }

            await setStatus(data, reservation_id, abortController.signal)
            history.push('/dashboard')
        } catch(error) {
            setErrors(error)
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

    return (
        <div>
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={errors} />
            <h1 className="mt-3">Seat Reservation Number: {reservation_id}</h1>
            <div className="card" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Reservation Date: {reservation.reservation_date}<br />
                    Reservation Time: {reservation.reservation_time}<br />
                    Amount of People: {reservation.people}</p>
                    <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {coloredText(reservation.status)}</p>
                    <div>
                        <a href={`/reservations/${reservation_id}/edit`}><button type="Edit" className="btn btn-secondary m-2">Edit</button></a>
                    </div>
                </div>
            </div>
            <div className="form-group mt-3">
                <h4>Tables:</h4>
                <select name="table_id" className="form-control" style={{"width": "400px"}}>
                    {(tables.map((table) => {
                        // if(table.capacity >= reservation.people) {
                            return <option key={table.table_name} id={table.table_id}>{table.table_name} - {table.capacity}</option>
                            // }
                            // return null
                        }
                    ))}
                </select>
                <button type="submit" className="btn btn-primary m-2" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </div>
        </div>
    )
}

export default SeatReservation