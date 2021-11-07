import React from "react"
import image_table from "../images/image_table.jpeg"
import image_table_bar from "../images/image_table_bar.jpeg"

function Tables({tables}) {
    const list = tables.map((table) => {
        const table_id = table.table_id
        return (
            <div className="card" style={{"width": "18rem"}} key={table_id}>
                <img className="card-img-top" src={!table.table_name.toLowerCase().includes("bar") ? image_table : image_table_bar} alt="Not responsive"/>
                <div className="card-body">
                    <h5 className="card-title">Table Name: {table.table_name}</h5>
                    <p className="card-subtitle">Capacity: {table.capacity}</p>
                    {table.reservation_id && <p className='card-subtitle mt-1'>Reservation ID: {table.reservation_id}</p>}
                    <p data-table-id-status={tables.table_id} className="mt-1">Availability: {table.occupied ? "Occupied" : "Free" }</p>
                </div>
            </div>
        )
    })
    return (
        <>
            {list}
        </>
    )
}

export default Tables