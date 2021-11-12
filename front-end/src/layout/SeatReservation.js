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
        // console.log(reservation_id)
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

    return (
        <div>
            {/* {JSON.stringify(reservation)} */}
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={errors} />
            <h1>Seat Reservation Number: {reservation_id}</h1>
            <div className="card" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Amount of People: {reservation.people}</p>
                    <div>
                        <a href={`/reservations/${reservation_id}/edit`} className="btn btn primary"><button type="Edit" className="btn btn-secondary p-1">Edit</button></a>
                        {/* <button type="Cancel" className="btn btn-danger" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button> */}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>Table</label>
                <select name="table_id" className="form-control">
                    {(tables.map((table) => {
                        // if(table.capacity >= reservation.people) {
                            return <option key={table.table_name} id={table.table_id}>{table.table_name} - {table.capacity}</option>
                            // }
                            // return null
                        }
                    ))}
                </select>
                <button type="submit" className="btn btn-primary" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </div>
        </div>
    )
}

export default SeatReservation