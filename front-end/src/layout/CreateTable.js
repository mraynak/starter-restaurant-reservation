import React, {useState} from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "./ErrorAlert"
import { createTable } from "../utils/api"


function CreateTable() {
    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: ""
    }

    const [formData, setFormData] = useState(initialFormState)
    const [reservationError, setReservationError] = useState(null)
    const [capacityError, setCapacityError] = useState(null)

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        
        createTable(formData, abortController.signal)
        .then(() => {history.push("/")})
        .catch(setReservationError)
    }

    function changeHandler({target}) {
        // console.log(typeof Number(target.value))
        if(target.name === "capacity") {
            if(target.value < 1) {
                setCapacityError({
                    message: "Table capacity must be more than 0"
                })
            }
            if(target.value > 0 || !target.value) {
                setCapacityError(null)
            }
            const capacityNum = Number(target.value)
            console.log(typeof capacityNum)
            setFormData({
                ...formData,
                capacity: capacityNum
            })
        } else {
            setFormData({
                ...formData,
                [target.name]: target.value
            })
        }
        console.log(typeof formData.capacity)
    }
    return (
        <>
        <div>
            <ErrorAlert error={reservationError} />
            <h1>Create Table</h1>
            <form>
                <div className="form-group">
                    <label className="form-label" htmlFor="table-name">Table Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-input"
                        name="table_name"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Table Name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="capacity">Capacity:</label>
                    <ErrorAlert error={capacityError} />
                    <input
                        type="number"
                        className="form-control"
                        id="form-input"
                        name="capacity"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Capacity"
                    />
                </div>
                <button type="submit" className="btn btn-primary" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </form>
        </div>
        </>
    )
}

export default CreateTable