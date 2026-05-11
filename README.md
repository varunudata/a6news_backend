# A6News - Backend

This is the backend API and database service for **A6News**, providing the core functionality for managing users, categories, and news posts. It is built with Express.js and utilizes Prisma ORM to interact with a PostgreSQL database securely and efficiently.

🔗 **[Frontend Repository](https://github.com/varunudata/a6news_frontend.git)**

##  Features

- **Robust REST API:** Comprehensive endpoints for all Content Management System (CMS) operations.
- **Secure Authentication:** User registration, login, and protected routes using JSON Web Tokens (JWT) and Bcrypt for password hashing.
- **Relational Database:** Structured data models for Users, Categories, and Posts using PostgreSQL.
- **File Handling:** Supports `multipart/form-data` via Multer, enabling rich media post submissions.
- **Scalable Architecture:** Clean separation of concerns with dedicated routes, controllers, and services.

##  Technology Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)
- **Authentication:** `jsonwebtoken` (JWT), `bcrypt`
- **Utilities:** `multer`, `cors`, `slugify`, `dotenv`

## 📁 Directory Structure

```text
server/
├── controllers/      # Handles incoming HTTP requests and API responses
├── middlewares/      # Express middlewares (e.g., JWT token verification)
├── prisma/           # Database schema definition (schema.prisma)
├── routes/           # API route declarations (auth, categories, posts)
├── services/         # Core business logic
├── utils/            # Helper functions
├── .env              # Environment variables
└── server.js         # Express application entry point
```

##  Getting Started

### Prerequisites

- Node.js (v18.x or newer recommended)
- npm, yarn, or pnpm
- A running PostgreSQL database instance (local or hosted like Neon/Supabase)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <REPLACE_WITH_BACKEND_REPO_URL>
   cd server
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root of the project:
   ```bash
   touch .env
   ```
   Add the following variables:
   ```env
   PORT=4004
   DATABASE_URL="postgresql://user:password@localhost:5432/a6news?schema=public"
   JWT_SECRET="your_super_secret_jwt_key_here"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_name" # If required by your client
   ```

4. Set up the Database:
   Sync the Prisma schema with your PostgreSQL database:
   ```bash
   npx prisma db push
   # Alternatively, if you use migrations: npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm start
   ```
   The backend will now be running on `http://localhost:4004`.

##  API Endpoints Overview

- **Auth** (`/api/auth`): Registration and login endpoints.
- **Categories** (`/api/categories`): Fetch, create, update, and delete categories.
- **Posts** (`/api/posts`): Comprehensive CRUD operations for news articles, including fetching by category and updating view statistics.

##  Database Models

- **User**: Authentication credentials and role-based access.
- **Category**: Classifications for news articles.
- **Post**: Complete article data including `title`, `slug`, `content`, `thumbnail`, `gallery`, `tags`, and `status` (DRAFT / PUBLISHED).
