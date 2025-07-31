# 🐶 Dog Breed Application

This is a full-stack web application designed to manage a collection of dog breeds and their associated types. The application consists of a **React** frontend and a **Node.js (Express)** backend API.

---

## 🚀 Features

- **View All Breeds**: Display a list of all dog breeds and their types.
- **Add New Breed**: Create new dog breed entries with their initial types.
- **Edit Existing Breed**: Update the types associated with an existing dog breed.
- **Delete Breed**: Remove dog breed entries from the collection.
- **Responsive UI**: A user-friendly interface built with React and styled using Tailwind CSS + DaisyUI.
- **RESTful API**: A robust backend API to handle all data operations.

---

## 💻 Technologies Used

### Frontend

- **React**: JavaScript library for building UIs.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **DaisyUI**: Tailwind CSS plugin that provides pre-built accessible components.
- **Jest**: JavaScript testing framework.
- **React Testing Library**: For testing UI components from a user’s perspective.
- **Mock Service Worker (MSW)**: For mocking API responses in development/testing (unit tests used direct Jest mocks).

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Minimalist web framework for Node.js.
- **Jest**: For backend unit/integration tests.
- **Supertest**: HTTP assertions for Express endpoints.
- **Dotenv**: For managing environment variables.
- **Data Storage**: Connect backend to a persistent database MongoDB Atlas.

---

## ⚙️ Setup and Installation

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** or **Yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/Arpitha-nc/Dog-Breed-Manager.git
cd Dog-Breed-Manager

```

### 2. Backend Setup

```bash
cd backend
npm install
```

Environment Variables
Create a .env file inside the backend/ directory:

```bash
PORT = 3000
MONGODB_URI = mongo connection string
NODE_ENV = "development"
```

### 3. Frontend Setup

```bash
   cd ../frontend
   npm install
```

▶️ Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

Runs on: http://localhost:3000

### 2. Start the Frontend Application

```bash
cd frontend
npm start
```

Runs on: http://localhost:5173

✅ Running Tests
Backend Tests

```bash
cd backend
npm run test
```

- Verifies CRUD operations (/dogs, /dogs/:id)
- Handles status codes, errors (400, 404), and data validation
- Skips real DB connection during testing

Frontend Tests

```bash
cd frontend
npm test
```

- Tests UI behavior via Jest + React Testing Library
- Uses jest.mock() for mocking API

Focus areas:

- Navbar.test.js: Renders nav correctly
- BreedModal.test.js: Tests modal behavior and inputs
- BreedCard.test.js: Verifies update/delete operations
- Dashboard.test.js: High-level integration of components

🚀 Future Enhancements

- Implement user authentication and authorization
- Add detailed breed info (e.g., origin, temperament, image upload)
- Add search, filter, and sort features
- Improve error messages and UI feedback
- Add pagination for breed lists
