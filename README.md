# Library System API (Backend)

This is the backend API for the Library System application, built for ITELECT4. It handles user authentication, book management, and transaction processing using a MongoDB database.

## 🌐 Live API
**[Insert your Vercel Backend URL here, e.g., https://itelect4-backend-six.vercel.app]**

##  Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Deployment:** Vercel

## 📂 Project Structure
- `src/config/`: Database connection logic (serverless-friendly).
- `src/data/`: Seed data for reference resources (Books).
- `src/middleware/`: Authentication middleware (`requireAuth`).
- `src/models/`: Mongoose schemas for User, Book, and Transaction.
- `src/routes/`: Express routers for Auth, Books, and Transactions.
- `src/types/`: Shared TypeScript interfaces.

## 🔌 API Endpoints

### Public Routes (No Token Required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Checks API and database connection status. |
| `GET` | `/api/books` | Returns a list of all available books. |
| `GET` | `/api/books/:id` | Returns details for a specific book. |
| `POST` | `/api/auth/register` | Creates a new user account. |
| `POST` | `/api/auth/login` | Authenticates a user and returns a JWT. |

### Protected