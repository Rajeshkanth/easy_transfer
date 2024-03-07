# Easy Transfer Overview

This document provides an overview of the payment application's frontend structure.

## Frontend (React)

### App Component (`App.js`)

The `App` component serves as the entry point of the application. It manages the state and context using React hooks and creates a context for sharing data between components. It also initializes the socket connection and sets up routing for different pages using React Router.

### Login & SignUp Component

These components handles the user to login or sign up to use their respective accounts to send money from one bank account to another `mock`.

### PaymentPage Component (`PaymentPage.js`)

The `PaymentForm` component handles user input for transferring amounts and recipient details. It uses context to access and update state values like amounts, account numbers, and the socket connection. It emits a `paymentPageConnected` event upon form submission, triggering a transaction confirmation.

### Success Component (`Success.js`)

The `Success` component displays the transaction status after submission. It listens for socket/http events like `success` and `failed`, updating the UI based on transaction outcomes. Additionally, it handles confirmation alerts and redirects users based on transaction success or failure.

## Backend (Socket.io with Express)

The backend uses Socket.io and http request/response with Express to manage real-time communication and ejs view engine is used to create ui for the confirmation/cancelation page.

The backend code is deployed here in the repository named as `easy_transfer_server`

### Socket.io Server (`server.js`)

The Socket.io server handles various events like `paymentPageConnected`, `join_success_room`, `clicked`, and `canceled`. It manages rooms for different tabs, emits confirmation alerts, and handles success/failure events for transactions.

### Polling

The polling is another configuration for confirm/cancel the alerts initiated from `easy_transfer` webpage. It handles multiple endpoints to login authentication, saving accounts, verifying the payment transactions.

---to run the application

# First install the dependencies

Navigate to the frontend directory (where package.json is located).
Run

#### `npm install`

to install all the required dependencies.

## Available Scripts

In the project directory, you can run:

### `npm start`

This command for use the polling configuration

### `npm run start:socket`

This command for use the socket configuration

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Deployment

### `npm run deploy` to deploy in github

### Note

Ensure that both frontend and backend servers are running simultaneously for the application to work correctly.

> > > > > > > d1910345aa4f153e090f77d32fcd94ef68cb53a7
