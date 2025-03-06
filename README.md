# Backend: Node.js + SQLite CRUD Application

This is a Node.js application with a backend powered by **Express** and a database powered by **SQLite3**. The app allows you to perform **CRUD** (Create, Read, Update, Delete) operations on users, with the frontend serving as a simple UI to interact with the database.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

You can download and install Node.js from the official website:  
[https://nodejs.org/](https://nodejs.org/)

## Installation

1. Clone this repository or navigate to the project directory.


## Running the Application

1. **Start the backend server:**


The backend will be hosted on `http://localhost:3000`.

2. **Open the frontend** by navigating to `http://localhost:3000` in your browser.  
   The frontend will interact with the backend to add, view, update, and delete users.

## API Endpoints

The backend provides the following **RESTful API** endpoints:

- **POST `/users`**: Create a new user
    - Request body: 
      ```
      {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "address": "123 Main St",
        "contact_number": "1234567890"
      }
      ```
    - Response: Returns the newly created user with `id`.

- **GET `/users`**: Get all users
    - Response: Returns an array of all users in the database.

- **PUT `/users/:id`**: Update a user by ID
    - Request body: 
      ```
      {
        "first_name": "Updated Name"
      }
      ```
    - Response: Returns a success message.

- **DELETE `/users/:id`**: Delete a user by ID
    - Response: Returns a success message.

## Frontend (HTML)

The frontend is a simple **HTML/CSS/JS** page that allows you to:

1. Add new users
2. View all users
3. Update user details (via inline editing)
4. Delete users

You can find the frontend files inside the `public/` folder.

## Error Handling

- If any of the fields are missing when adding a user, the backend will return a `400` status with an error message.
- If trying to update a non-existent user, the backend will return a `404` status.

]

## Authors

- [Prahlad Timalsina](https://github.com/prahladtimalsina)

