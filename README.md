# Node.js E-Commerce API

A comprehensive **RESTful API** for an E-Commerce platform built with the **MERN Stack** (Node.js, Express, MongoDB). This backend provides a secure and scalable foundation for managing products, users, and orders.

---

## Features

* **Authentication & Authorization**: Secure user registration and login using **JWT** and **Bcrypt** for password hashing.
* **Product Management**: Full CRUD operations for products with category filtering.
* **Shopping Cart**: Specialized logic for managing user carts and persisting data.
* **Order Processing**: Complete workflow from checkout to order history.
* **Security**: Implementation of middleware for protected routes and role-based access control.
* **Database**: Structured data modeling using **Mongoose** with optimized queries.

---

## Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Security**: JSON Web Tokens (JWT), Bcrypt.js
* **Environment**: Dotenv for configuration management

---

## Getting Started

### Prerequisites
* Node.js (v14+ recommended)
* MongoDB (Local or Atlas)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/nurehab/nodejs-ecommerce.git](https://github.com/nurehab/nodejs-ecommerce.git)
    cd nodejs-ecommerce
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add your credentials:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

4.  **Run the application**:
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

---

## Project Structure

```bash
├── config/         # Database connection & environment settings
├── controllers/    # Request handling logic
├── models/         # Mongoose schemas & data logic
├── routes/         # API route definitions
├── middleware/     # Auth and error handling filters
├── utils/          # Helper functions
└── server.js       # Application entry point
```


## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & return JWT |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get product details |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/user` | View order history |
