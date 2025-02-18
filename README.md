# PasswordGuardian

PasswordGuardian is a secure, full-stack password management tool designed to help users store, manage, and retrieve their passwords with ease. Built using modern web technologies, it aims to offer both a robust backend and a sleek, user-friendly frontend experience.

## Features

- **User-Friendly Interface:** Clean and intuitive UI for effortless navigation.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.
- **Full-Stack Architecture:** Separates client and server logic for scalability.
- **Modular Codebase:** Organized structure with shared utilities between client and server.

## Tech Stack

- **Frontend:** 
  - HTML
  - TypeScript
  - Vite
  - Tailwind CSS
  - React
- **Backend:**
  - Node.js with TypeScript
  - Javascript
  - Expree.js
- **Database & ORM:**
  - PostgreSQL
  - Drizzle ORM (configured via `drizzle.config.ts`)
- **Other Tools:**
  - PostCSS for styling

## Folder Structure

- **`client/`**: Contains the frontend application code.
- **`server/`**: Contains the backend API and server-related logic.
- **`shared/`**: Houses shared modules, types, and utilities used by both client and server.
- **`attached_assets/`**: Includes any images, icons, or other assets used in the project.
- **Configuration Files**: Root-level files such as `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, and others for project setup and tooling.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Himanshu-Raj-Kukreja/PasswordGuardian.git

2. **Navigate to the Project Directory:**
    ```bash
    cd PasswordGuardian

3. **Install Dependencies:**
    ```bash
    npm install

4. **Set Up Environment Variables:** Create a .env file in the server/ directory (or root, if applicable) with the necessary configurations (e.g., database connection strings, encryption keys).

## Running the Project

**Development**
  - Start the Frontend (Client):
  **`npm run dev`**

  - Start the Backend (Server):
  **`npm run server`**
  (Ensure that any required environment variables are set before running the development servers.)

**Production**
  - Build the Application:
  **`npm run build`**

**Start the Production Server:**
  **`npm run start`**
