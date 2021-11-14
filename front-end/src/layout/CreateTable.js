import React, {useState, useEffect} from "react"
import { useHistory } from "react-router-dom"
import ErrorAlert from "./ErrorAlert"
import { createTable } from "../utils/api"
import { listTables } from "../utils/api";
import Tables from "../dashboard/Tables"


function CreateTable() {
    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: ""
    }

    const [formData, setFormData] = useState(initialFormState)
    const [reservationError, setReservationError] = useState(null)
    const [capacityError, setCapacityError] = useState(null)
    const [tables, setTables] = useState([])

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        
        createTable(formData, abortController.signal)
        .then(() => {history.push("/")})
        .catch(setReservationError)
    }

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
                        style={{"width": "400px"}}
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
                        style={{"width": "400px"}}
                        type="number"
                        className="form-control"
                        id="form-input"
                        name="capacity"
                        required={true}
                        onChange={changeHandler}
                        placeholder="Capacity"
                    />
                </div>
                <button type="submit" className="btn btn-primary m-2" onClick={submitHandler}>Submit</button>
                <button type="cancel" className="btn btn-secondary" onClick={history.goBack}>Cancel</button>
            </form>
            <div className="d-md-flex mb-3 mt-3">
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