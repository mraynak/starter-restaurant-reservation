import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { createReservation } from "../utils/api"
import ErrorAlert from "./ErrorAlert"

function CreateReservation() {
    const history = useHistory()
    const query = useQuery()
    const date = query.get("date") ? query.get("date") : today()

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: date,
        reservation_time: "",
        people: 1,
        status: "booked"
    }

    const [formData, setFormData] = useState(initialFormState)
    const [reservationError, setReservationError] = useState(null)
    const [peopleError, setPeopleError] = useState(null)
    const [dateError, setDateError] = useState(null)
    const [dayError, setDayError] = useState(null)
    const [timeError, setTimeError] = useState(null)
    const [pastTimeError, setPastTimeError] = useState(null)

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        setTimeError(null)
        createReservation(formData, abortController.signal)
        .then(() => {history.push(`/dashboard?date=${formData["reservation_date"]}`)})
        .catch(setReservationError)
    }

    function changeHandler({target}) {
        
        if(target.name === "reservation_date") {
            const resDate = Date.parse(target.value) + 77400000
            const resDay = new Date(target.value).getDay()
            const date = Date.now() - 25200000
            if(resDate < date) {
                setDateError({
                    message: "Selected reservation date has already passed, date must be today or in the future"
                })
            }
            if(resDate > Date.now()) {
                setDateError(null)
            }
            if(resDay + 1 === 2) {
                setDayError({
                    message: "Reservation day is invalid. The restuarant is closed on Tuesdays"
                })
            }
            if(resDay + 1 !== 2) {
                setDayError(null)
            }
        }
        if(target.name === "reservation_time") {
            const data = document.querySelector("input[name='reservation_date']")
            const value = data.value
            const parseTime = Date.parse(value)
            const resTimeOfDay = (Number(target.value.substring(0,2) * 60) + Number(target.value.substring(3))) * 60000
            const resTime = (resTimeOfDay + parseTime)
            const time = Date.now() - 25200000
            if(resTime < time) {
                setPastTimeError({
                    message: `Selected reservation time has already passed, time must be today or in the future`
                })
            }
            if(resTime >= time) {
                setPastTimeError(null)
            }
            // if(target.value < "10:30" || target.value > "21:30") {
            //     setTimeError({
            //         message: `Reservation time must be after 10:30am and before 9:30pm as we are close or time is too close to closing`
            //     })
            // }
            // if(target.value >= "10:30" && target.value <= "21:30") {
            //     setTimeError(null)
            // }
        }
        if(target.name === "people") {
            if(target.value < 1) {
                setPeopleError({
                    message: "Amount of people must be more then 0"
                })
            } 
            if(target.value > 0 || !target.value) {
                setPeopleError(null)
            }
            const peopleNum = Number(target.value)
            setFormData({
                ...formData,
                people: peopleNum
            })
        } else {
        setFormData({
            ...formData,
            [target.name]: target.value
        });
        }
    }

    return (
        <>
        <div>
            <ErrorAlert error={reservationError} />
            <h1 className="mt-3">Create Reservation</h1>
            <form>
                <div className="form-group col-xs-3">
                    <label className="form-label" htmlFor="first-name">First Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-input"
                        name="first_name"
                        required={true}
                        onChange={changeHandler}
                        placeholder="First Name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="last-name">Last Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-input"
                        name="last_name"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Last Name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="modile-number">Phone Number:</label>
                    <input
                        type="tel"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        className="form-control"
                        id="form-input"
                        name="mobile_number"
                        required={true}
                        onChange={changeHandler}
                        placeholder="123-456-7890"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="date">Reservation Date:</label>
                    <ErrorAlert error={dateError} />
                    <ErrorAlert error={dayError} />
                    <input
                        type="date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        className="form-control"
                        id="form-input"
                        name="reservation_date"
                        required={true}
                        onChange={changeHandler}
                        placeholder="YYYY-MM-DD"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="time">Reservation Time:</label>
                    <ErrorAlert error={timeError} />
                    <ErrorAlert error={pastTimeError} />
                    <input
                        type="time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        className="form-control"
                        id="form-input"
                        name="reservation_time"
                        required={true}
                        onChange={changeHandler}
                        placeholder="HH:MM"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="people">Number of People:</label>
                    <ErrorAlert error={peopleError} />
                    <input
                        type="number"
                        className="form-control"
                        id="form-input"
                        name="people"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Number of People"
                    />
                </div>
                <div className="mb-3">
                <button type="submit" className="btn btn-primary submit_button" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default CreateReservation