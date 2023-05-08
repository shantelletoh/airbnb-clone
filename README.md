# Airbnb Clone

This is a rental booking app, similar to Airbnb. It was created with the MERN (MongoDB, ExpressJS, ReactJS, NodeJS) stack.

## Features

- Rental places gallery with search and filter functionalities
- Login and Register pages with guest login
- Form to create a place
- Place details pages with a booking widget
- Account page with the user's profile, accommodations, and bookings
- Real-time messenger for potential patrons to contact rental hosts

## Available Scripts

You can clone the repo and run it locally:

In **a terminal/command prompt** window, run:

```
cd client
npm i && npm run dev
```

(or `yarn && yarn dev` for `yarn` users)
&nbsp;

&nbsp;

In the `server` directory, open the `.env.example` file.<br>
Rename the file to `.env`.<br>
Replace `your_mongodb_url` and `your_jwt_secret_key` with your own credential values, respectively.
&nbsp;

&nbsp;

In a **_second terminal/command_** prompt, run:

```
cd server
npm i && npm start
```

(or `yarn && yarn start` for `yarn` users)

When both commands finish running, open http://localhost:5173/ with your browser to see the result.
