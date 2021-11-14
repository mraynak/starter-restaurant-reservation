import React, {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"
import { listReservationsByNumber } from "../utils/api";
import Reservation from "../dashboard/Reservation";
import ErrorAlert from "./ErrorAlert"
import useQuery from "../utils/useQuery";

function SearchByNumber(){
    const history = useHistory()
    const query = useQuery()
    const phone = query.get("mobile_number") ? query.get("mobile_number") : null

    const initialFormState = {
        mobile_number: phone,
    }

    const [numberError, setNumberError] = useState(null)
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [formData, setFormData] = useState(initialFormState)

    useEffect(loadReservations, [phone])

    function loadReservations() {
        const abortController = new AbortController()
        setReservationsError(null)
        listReservationsByNumber(formData.mobile_number)
            .then(setReservations)
            .catch(setReservationsError)
        return () => abortController.abort();
    }

    async function searchHandler(event) {
        setReservations([])
        event.preventDefault()
        const abortController = new AbortController()
        setReservationsError(null)
        await listReservationsByNumber(formData.mobile_number, abortController.signal)
            .then(setReservations)
            .then(() => {history.push(`/search?mobile_number=${formData.mobile_number}`)})
            .catch(setReservationsError)
    }

    function changeHandler({target}) {
        if(target.name === "mobile_number") {
            if(target.value.length < 1 ) {
                setNumberError({
                    message: "Mobile number must be included"
                })
            }
            if(target.value.length >= 1) {
                setNumberError(null)
            }
        }
        setFormData({
            [target.name]: target.value
        });
    }
    return (
        <>
        <div>
            <ErrorAlert error={reservationsError} />
            <h1 className="mt-3">Search</h1>
            <form>
                <div className="form-group">
                    <label className="form-label" htmlFor="mobile_number">Mobile Number:</label>
                    <ErrorAlert error={numberError} />
                    <input
                        style={{"width": "400px"}}
                        type="text"
                        className="form-control"
                        id="form-input"
                        name="mobile_number"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Enter a customer's phone number"
                    />
                </div>
                <button type="submit" className="btn btn-primary m-2"onClick={searchHandler}>Find</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </form>
            <h4 className= "m-2">Reservations:</h4>
            {reservations.length === 0 && <ErrorAlert error={{message: 'No reservations found'}} />}
            <div className="m-3">
                <div className="row">
                    <Reservation reservations={reservations} />
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchByNumber