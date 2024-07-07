# Notes Application

A simple web-based notes application that allows users to create, edit, delete, and search notes. The application also supports reminders and tags for easy organization and retrieval of notes.
Login to https://notes-app-0qjr.onrender.com to experience this app

## Features
- Register new user and login
- Create, edit and delete notes.
- Add tags to notes.
- Search notes by tags or content.
- Set reminders for notes.
- Archive and trash notes.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/notes-app.git
    cd notes-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Start the server:

    ```bash
    sh startup.sh
    ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

### Usage

- **Create a Note**: Click the "Add Note" button, fill in the content, add tags and set a reminder if needed.
- **Edit a Note**: Click the "Edit" button on a note to modify its content.
- **Delete a Note**: Click the "Trash" button on a note to move it to the trash.
- **Search Notes**: Use the search bar to find notes by content or tags.
- **Archive a Note**: Click the "Archive" button on a note to move it to the archive.
- **Set a Reminder**: Click the reminder button to set a date and time reminder for a note.

### Code Structure

- **public/**: Contains static files like HTML, CSS, and client-side JavaScript.
- **/**: Contains server-side code.
  - **server/**: Server and Migration file
    - **server.js**: Entry point for the server.
    - **migration.js**: Migration file for creating the database schema.
  - **routes/**: Contains route handlers for the application.
  - **controllers/**: Contains the business logic for the application.
  - **models/**: Contains the database models.
  - **config/**: Contains db config and queries.

### Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

