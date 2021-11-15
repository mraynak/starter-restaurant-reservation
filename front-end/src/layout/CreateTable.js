import React, {useState, useEffect} from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "./ErrorAlert"
import { createTable } from "../utils/api"
import { listTables } from "../utils/api";
import Tables from "../dashboard/Tables"


function CreateTable() {
    const history = useHistory()

    //set initial form state to empty
    const initialFormState = {
        table_name: "",
        capacity: ""
    }
    
    //sets state variables
    const [formData, setFormData] = useState(initialFormState)
    const [reservationError, setReservationError] = useState(null)
    const [capacityError, setCapacityError] = useState(null)
    const [tables, setTables] = useState([])

    //button click handler to add new table to database
    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        
        createTable(formData, abortController.signal)
        .then(() => {history.push("/")})
        .catch(setReservationError)
    }

    //recognize changes and set form data to new changes also sets errors if fields contain invalid data
    function changeHandler({target}) {
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
    }

    //lists all existing tables
    useEffect(loadDashboard, []);

    function loadDashboard() {
        setTables([])
        const abortController = new AbortController();
        listTables(abortController.signal)
          .then(setTables)
        return () => abortController.abort();
      }

    return (
        <>
        <div>
            <ErrorAlert error={reservationError} />
            <h1 className="mt-3">Create Table</h1>
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
                <button type="submit" className="btn btn-primary submit_button" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </form>
            <div className="d-md-flex mt-3">
                <h4 className="mb-0">Tables:</h4>
            </div>
            <div className="m-3">
                <div className="row">
                    <Tables tables={tables} loadDashboard={loadDashboard}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreateTable