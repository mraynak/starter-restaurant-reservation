import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router"
import { previous, next, today } from "../utils/date-time"
import Reservation from "./Reservation"
import Tables from "./Tables"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    setReservations([])
    setTables([])
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="mt-3">Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="m-2 ml-4">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <button className="btn btn-secondary submit_button" onClick={event => history.push(`/dashboard?date=${previous(date)}`)}>Previous Day</button>
        <button className="btn btn-primary" onClick={event => history.push(`/dashboard?date=${today()}`)}>Today</button>
        <button className="btn btn-secondary m-2" onClick={event => history.push(`/dashboard?date=${next(date)}`)}>Next Day</button>
      </div>
      <div className="m-3">
        <div className="row">
        <Reservation reservations={reservations} loadDashboard={loadDashboard}/>
        </div>
      </div>
      <div className="d-md-flex">
        <h4>Tables:</h4>
      </div>
      <div className="m-3">
        <div className="row">
        <Tables tables={tables} loadDashboard={loadDashboard}/>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
