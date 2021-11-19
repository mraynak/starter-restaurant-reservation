import React, {useState, useEffect} from "react";
import {readReservation, editReservation} from "../utils/api"
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "./ErrorAlert"
import Form from "./Form"


function EditReservation() {

    //set state variables 
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [formData, setFormData] = useState({})

    const history = useHistory()
    const {reservation_id} = useParams()

    //loads reservation being edited
    useEffect(loadReservation, [reservation_id])

    function loadReservation() {
        const abortController = new AbortController()
        setReservationError(null)
        readReservation(reservation_id)
            .then(setReservation)
        readReservation(reservation_id)
            .then(res => setFormData({
                reservation_id: reservation_id,
                first_name: res.first_name,
                last_name: res.last_name,
                mobile_number: res.mobile_number,
                reservation_date: res.reservation_date,
                reservation_time: res.reservation_time,
                people: res.people,
                status: res.status
            }
        ))
            .catch(setReservationError)
        return () => abortController.abort();
    }

    //button click handler for submitting edits to change in the database
    async function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        editReservation(formData, abortController.signal)
        .then(() => {history.push(`/dashboard?date=${reservation.reservation_date}`)})
        .catch(setReservationError)
    }

    //conditional rendering to set status color
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
            <h1 className="mt-3">Edit Reservation Number: {reservation_id}</h1>
            <div className="card ml-4 mt-3" style={{"width": "18rem"}} key={reservation_id}>
                <div className="card-body">
                    <h5 className="card-title">Name: {reservation.first_name} {reservation.last_name}</h5>
                    <h6 className="card-subtitle">Mobile Number: {reservation.mobile_number}</h6>
                    <p className="card-text">Reservation Date: {reservation.reservation_date}<br />
                    Reservation Time: {reservation.reservation_time}<br />
                    Amount of People: {reservation.people}</p>
                    <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {coloredText(reservation.status)}</p>
                    <div>
                        {reservation.status === "booked" ? <a href={`/reservations/${reservation_id}/seat`}><button type="submit" className="btn btn-primary m-2">Seat</button></a> : null}
                    </div>
                </div>
            </div>
            <h4 className= "mt-3">Edit Fields:</h4>
            <Form formData = {formData} setFormData = {setFormData} submitHandler={submitHandler} reservation ={reservation}/>
        </div>
    )
}

export default EditReservation