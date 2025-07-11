# Bible Memory App

A full-stack web application designed to help users memorize Bible verses through various interactive learning techniques.

## Live Demo

You can see a live demo of the application here: [lamptomyfeet.co](https://lamptomyfeet.co)

## Features

- **User Authentication:** Secure registration and login with JWT.
- **Bible Verse Search:** Search for any Bible verse using standard references (e.g., "John 3:16") across multiple translations.
- **Multiple Learning Methods:**
    - Read aloud
    - Fill in the blanks
    - Write from memory
    - Verse breakdown
- **Progress Tracking:** Users can track their memorization progress.
- **Memorized Verses:** A dedicated section to review all the verses the user has memorized.
- **Ranking System:** A leaderboard to motivate users.
- **User Dashboard:** A user profile to view account information.

## Tech Stack

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **Vite:** A modern and fast build tool for frontend development.
- **TypeScript:** A superset of JavaScript that adds static typing.
- **React Router:** For routing in the single-page application (SPA).
- **TanStack React Query:** For data fetching, caching, and state management.
- **Axios:** For making HTTP requests to the backend and external APIs.
- **Framer Motion:** For smooth and engaging animations.
- **Bootstrap:** For responsive design and UI components.
- **React Toastify:** For notifications and alerts.

### Backend
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A web application framework for Node.js.
- **MySQL:** As the primary database for storing user data and progress.
- **JSON Web Tokens (JWT):** For secure authentication and session management.
- **External Bible API:** Integrates with an external API for verse lookup and retrieval.
- **bcrypt:** For password hashing.
- **CORS:** To enable secure cross-origin requests.
- **Dotenv:** For managing environment variables.

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the React application.
- `backend/`: Contains the Node.js server and API.

## Installation Guide

Follow these steps to run the project on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm
- A running instance of a MySQL database.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following variables:
    ```
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    JWT_SECRET=a_very_secure_secret
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:3001` (or the port you have configured).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development application:**
    ```bash
    npm run dev
    ```
    The application will open at `http://localhost:5173`.

## API Endpoints

Here is a list of the available API endpoints.

### Authentication
- `POST /api/auth/register`: Registers a new user.
- `POST /api/auth/login`: Logs in a user.

### User Data (Protected Routes)
- `GET /api/user/profile`: Gets the authenticated user's profile.
- `GET /api/memorized-verses`: Gets all verses memorized by the user.
- `POST /api/memorized-verses`: Adds a verse to the memorized list.
- `DELETE /api/memorized-verses/:verseId`: Deletes a verse from the memorized list.
- `GET /api/user/progress`: Gets the user's progress.
- `POST /api/user/progress`: Updates the user's progress.

### Ranking
- `GET /api/ranking`: Gets the user rankings.

### Server Health
- `GET /api/health`: Checks the server status.

## Deployment

The application is configured to be deployed on:
- **Frontend:** Vercel (see `frontend/vercel.json`).
- **Backend:** Railway (see `backend/RAILWAY_CONFIG.md`).

## How to Contribute

Contributions are welcome. Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/new-feature`).
3.  Make your changes and commit (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/new-feature`).
5.  Open a Pull Request.

## License

This project is under the MIT license.

