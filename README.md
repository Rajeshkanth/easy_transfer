# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<<<<<<< HEAD
=======

>>>>>>> d1910345aa4f153e090f77d32fcd94ef68cb53a7
# Payment Application Overview

This document provides an overview of the payment application's frontend and backend structure.

## Frontend (React)

### App Component (`App.js`)

The `App` component serves as the entry point of the application. It manages the state and context using React hooks and creates a context for sharing data between components. It also initializes the socket connection and sets up routing for different pages using React Router.

### Payment Form Component (`PaymentForm.js`)

The `PaymentForm` component handles user input for transferring amounts and recipient details. It uses context to access and update state values like amounts, account numbers, and the socket connection. It emits a `paymentPageConnected` event upon form submission, triggering a transaction confirmation.

### Success Component (`Success.js`)

The `Success` component displays the transaction status after submission. It listens for socket events like `success` and `failed`, updating the UI based on transaction outcomes. Additionally, it handles confirmation alerts and redirects users based on transaction success or failure.

## Backend (Socket.io with Express)

The backend uses Socket.io with Express to manage real-time communication.

### Socket.io Server (`server.js`)

The Socket.io server handles various events like `paymentPageConnected`, `join_success_room`, `clicked`, and `canceled`. It manages rooms for different tabs, emits confirmation alerts, and handles success/failure events for transactions.

---

This Markdown file outlines the structure and functionality of the payment application's frontend (built with React) and backend (Socket.io with Express).

<<<<<<< HEAD
=======

>>>>>>> d1910345aa4f153e090f77d32fcd94ef68cb53a7
---to run the application

# First install the dependencies

<<<<<<< HEAD
Navigate to the frontend directory (where package.json is located).
Run

#### `npm install`

to install all the required dependencies.

=======
  Navigate to the frontend directory (where package.json is located).
  Run 
  
  #### `npm install`
  
  to install all the required dependencies.
 
 
>>>>>>> d1910345aa4f153e090f77d32fcd94ef68cb53a7
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

<<<<<<< HEAD
=======

>>>>>>> d1910345aa4f153e090f77d32fcd94ef68cb53a7
### Deployment

### `npm run deploy` to deploy in github

### Note
<<<<<<< HEAD

Ensure that both frontend and backend servers are running simultaneously for the application to work correctly.
=======

Ensure that both frontend and backend servers are running simultaneously for the application to work correctly.

>>>>>>> d1910345aa4f153e090f77d32fcd94ef68cb53a7
