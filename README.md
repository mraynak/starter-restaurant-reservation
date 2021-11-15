# Capstone: Restaurant Reservation System

## Live link to deployed project

## API Documentation
Codes:

200: Success
201: Create successfully
400: Bad request
404: Not found
500: server error

### GET:
listReservations API:
Path: /reservations
Lists all reservations based on date

listTables API:
Path: /tables
Lists all tables

listReservationsByNumber API:
Path: /reservations?mobile_number=${mobile_number}
Lists all tables based on mobile_number

readReservation API:
Path: /reservations/${reservation_id}
Lists a single reservation based on reservation_id

### POST

createReservation API:
Path: /reservations
Creates a new reservation

createTable API:
Path: /tables
Creates a new table

### PUT

seatReservation:
Path: /tables/${table_id}/seat
Edits table to add reservation_id

setStatus:
Path: /reservations/${reservation_id}/status
Sets reservation status

editReservation:
Path: /reservations/${data.reservation_id}
Edits all desired fields of a reservation

### DELETE

finishReservation:
Path: /tables/${table_id}/seat
Edits table to delete reservation_id

## Summary

This site is intended to manage reservations and tables in a restaurant.
The site consists of 6 routes: dashboard page, create a new reservation page, create a new table page, search by a reservations number page, edit a reservation page and seat a reservation page.

All pages contain the menu that allow users to navigate through the site.

The dashboard page:
![alt text](/README_screenshots/dashboard.jpeg?raw=true "Optional Title")

This page shows a list of the reservations by the given date query, with a default date of today. The tables are also listed below the reservations. The next, previous and today buttons allow the user to navigate through dates. Entering a specific dateinto the url will also display reservations for that date.

The create reservation page:
![alt text](/README_screenshots/create_reservation.jpeg?raw=true "Optional Title")

This page conatins all fields required to create a new reservation. Errors for given entries will display above the fields if they do not meet the requirments. Upon submit if any errors given were ignored the page will display an error and the info will not be added to the database. Otherwise, the submit button will save the infromation in the database. The cancel button will return the user and nothing is saved in the database.

The create table page:
![alt text](/README_screenshots/create_table.jpeg?raw=true "Optional Title")

This page conatins all fields required to create a new table. Errors for given entries will display above the fields if they do not meet the requirments. Upon submit if any errors given were ignored the page will display an error and the info will not be added to the database. Otherwise, the submit button will save the infromation in the database. The cancel button will return the user and nothing is saved in the database.

The edit reservation page:
![alt text](/README_screenshots/edit.jpeg?raw=true "Optional Title")

This page has all the same fields as the create page, but the initial table state is set to the original info. The reservation being edited also appears at the top. Therefore, users can change only the desired fields and update. Errors for given entries will display above the fields if they do not meet the requirments. Upon submit if any errors given were ignored the page will display an error and the info will not be added to the database. Otherwise, the submit button will save the new infromation in the database. The cancel button will return the user and nothing is saved in the database.

The search page:
![alt text](/README_screenshots/search.jpeg?raw=true "Optional Title")

This page contains one field for entering a number and intially displays all the reservations. The number entered does not have to be complete and does not have to be in a specific format. The page will list all reservations that match the given number. An error will be displayed if the number enetered does not match any reservations.

The seat page:
![alt text](/README_screenshots/seat.jpeg?raw=true "Optional Title")

This page displays a dropdown list of tables and allows the user to seat a reservaion. If the table does not have enough capacity or the table is already sat an error message will be displayed. The reservation being sat is also listed at the top. The corresponsing tables within the database are updated accordingly.

## Technology used

This app is made primaryly with express and react. The front end is split into several components that are referenced through out. Any needed props are passed into these functions. On the frontend, UseEffect is applied to render pages when necessary. UseHistory is used to naviagte the pages upon button clicks. Date methods are used to find current times and dates through the project to ensure timing is correct for reservations. UseQuery is also applied to obtain url information when needed. On the backend, knex is used to obtain and update the correct information from the database. 

## Installation instructions

Fork and clone this repository

git clone (url)

Run: npm install

Using existing database:
To seed original data navigate to the backend folder and run: npx knex seed:run

Using your own database:
Update the backend env file. /backend-end/.env with your own url database.
Run: npx knex migrate:latest
Then run: npx knex seed:run

To run locally run: npm run start:dev
