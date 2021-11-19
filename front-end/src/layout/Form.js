import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import ErrorAlert from "./ErrorAlert"

function Form({formData, setFormData, submitHandler, reservation}) {

    //set state variables
    const [peopleError, setPeopleError] = useState(null)
    const [dateError, setDateError] = useState(null)
    const [dayError, setDayError] = useState(null)
    const [pastTimeError, setPastTimeError] = useState(null)

    const history = useHistory()

    //recognize changes and sets form data to new changes also sets errors if fields contain invalid data
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
                        placeholder={reservation ? reservation.first_name :"First Name"}
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
                        placeholder={reservation ? reservation.last_name :"Last Name"}
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
                        placeholder={reservation ? reservation.mobile_number :"123-456-7890"}
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
                        placeholder={reservation ? reservation.reservation_date :"YYYY-MM-DD"}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="time">Reservation Time:</label>
                    <ErrorAlert error={pastTimeError} />
                    <input
                        type="time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        className="form-control"
                        id="form-input"
                        name="reservation_time"
                        required={true}
                        onChange={changeHandler}
                        placeholder={reservation ? reservation.reservation_time : "HH:MM"}
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
                        placeholder={reservation ? reservation.people : "Number of People"}
                    />
                </div>
                <div className="mb-3">
                <button type="submit" className="btn btn-primary submit_button" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
                </div>
            </form>
    )
}

export default Form