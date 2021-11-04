import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router"
import { previous, next, today } from "../utils/date-time"
import Reservation from "./Reservation"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    setReservations([])
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  // console.log(reservations)

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <button className="btn btn-secondary" onClick={event => history.push(`/dashboard?date=${previous(date)}`)}>Previous Day</button>
        <button className="btn btn-primary" onClick={event => history.push(`/dashboard?date=${today()}`)}>Today</button>
        <button className="btn btn-secondary" onClick={event => history.push(`/dashboard?date=${next(date)}`)}>Next Day</button>
      </div>
      <div>
        <Reservation reservations= {reservations} />
      </div>
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
