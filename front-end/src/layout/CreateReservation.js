import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { createReservation } from "../utils/api"
import Form from "./Form"
import ErrorAlert from "./ErrorAlert"

function CreateReservation() {
    const history = useHistory()
    const query = useQuery()
    
    //sets date to the query date or today be default
    const date = query.get("date") ? query.get("date") : today()

    //sets initial form data to empty with exception of status which is automaticaly boooked
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: date,
        reservation_time: "",
        people: 1,
        status: "booked"
    }

    //set state variables
    const [formData, setFormData] = useState(initialFormState)
    const [reservationError, setReservationError] = useState(null)

    //button handler for submit button to add reservation to database
    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        createReservation(formData, abortController.signal)
        .then(() => {history.push(`/dashboard?date=${formData["reservation_date"]}`)})
        .catch(setReservationError)
    }

    return (
        <>
        <div>
            <ErrorAlert error={reservationError} />
            <h1 className="mt-3">Create Reservation</h1>
            <Form formData = {formData} setFormData = {setFormData} submitHandler={submitHandler} />
        </div>
        </>
    )
}

export default CreateReservation