import React, {useState, useEffect} from "react";
import {readReservation, editReservation} from "../utils/api"
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "./ErrorAlert"


function EditReservation() {
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [peopleError, setPeopleError] = useState(null)
    const [dateError, setDateError] = useState(null)
    const [dayError, setDayError] = useState(null)
    // const [timeError, setTimeError] = useState(null)
    const [pastTimeError, setPastTimeError] = useState(null)
    const [formData, setFormData] = useState({})

    const history = useHistory()
    const {reservation_id} = useParams()

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

    function changeHandler({target}) {
        console.log(formData)
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
            console.log(target.value)
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

    async function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        editReservation(formData, abortController.signal)
        .then(() => {history.push(`/dashboard?date=${reservation.reservation_date}`)})
        // .then(history.go(0))
        .catch(setReservationError)
    }

    
    return (
        <div>
            <ErrorAlert error={reservationError} />
            <h1>Edit Reservation Number: {reservation_id}</h1>
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
                        {/* <button type="Cancel" className="btn btn-danger p-1" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button> */}
                    </div>
                </div>
            </div>
            <form>
                <div className="form-group">
                    <label className="form-label" htmlFor="first-name">First Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-input"
                        name="first_name"
                        required={true}
                        onChange={changeHandler}
                        placeholder={reservation.first_name}
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
                        placeholder={reservation.last_name}
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
                        placeholder={reservation.mobile_number}
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
                        placeholder={reservation.reservation_date}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="time">Reservation Time:</label>
                    {/* <ErrorAlert error={timeError} /> */}
                    <ErrorAlert error={pastTimeError} />
                    <input
                        type="time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        className="form-control"
                        id="form-input"
                        name="reservation_time"
                        required={true}
                        onChange={changeHandler}
                        placeholder={reservation.reservation_time}
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
                        placeholder={reservation.people}
                    />
                </div>
                <button type="submit" className="btn btn-primary" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </form>
        </div>
    )
}

export default EditReservation