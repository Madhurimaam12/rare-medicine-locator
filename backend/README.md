# Rare Medicine Locator - Backend Documentation

## 1. Backend Overview

The backend of Rare Medicine Locator is a RESTful API built with Node.js and Express.js. It handles user authentication, medicine management, order processing, notification delivery, and all database operations. The API serves both the patient frontend and pharmacy frontend, providing secure access to data through JWT-based authentication.

## 2. Technology Stack

Node.js version 18 serves as the JavaScript runtime environment for server-side execution.

Express.js version 4.18 is the web framework used for building RESTful APIs and handling HTTP requests.

MongoDB Atlas version 6.0 provides cloud-based NoSQL database for data persistence.

Mongoose version 7.3 serves as the Object Data Modeling library for schema definition and validation.

JSON Web Token version 9.0 handles token-based authentication and authorization.

Bcryptjs version 2.4 performs password hashing for secure credential storage.

Nodemailer version 6.9 handles email transmission for order confirmations and notifications.

Cors version 2.8 enables Cross-Origin Resource Sharing for API security.

Dotenv version 16.0 manages environment variables for configuration security.

## 3. Folder Structure

The backend follows the Model-View-Controller pattern with the following structure.

The config folder contains database connection configuration.

The controllers folder contains business logic for authentication, medicines, requests, and orders.

The middleware folder contains JWT verification and authentication logic.

The models folder contains database schemas for User, Medicine, Request, Order, and Notification.

The routes folder contains API endpoint definitions for auth, medicines, requests, orders, and notifications.

The server.js file serves as the application entry point.

## 4. Database Models

User Model

The User model stores name as a required string, email as a required unique string used for authentication, password as a required hashed string using bcrypt algorithm, and role as a required enum with values user for patients or pharmacy for pharmacies. Timestamps are auto-generated for creation and last update.

Medicine Model

The Medicine model stores name as a required string representing the brand name, genericName as an optional string representing the chemical or generic name, manufacturer as a required string representing the pharmaceutical company, price as a required number in Indian Rupees, stock as a required number representing available quantity, location as a required string representing the city where medicine is available, and pharmacyId as a required string referencing the pharmacy user. Timestamps are auto-generated.

Request Model

The Request model stores medicineName as a required string, userId as a required string referencing the requesting patient, userName as an optional string, userEmail as an optional string, phoneNumber as an optional string, urgency as a required enum with values normal, high, or urgent, status as a required enum with values pending, approved, or rejected, and billingAddress as an optional string. Timestamps are auto-generated.

Order Model

The Order model stores requestId as a required ObjectId referencing the original request, userId as a required string referencing the ordering patient, userName and userEmail as optional strings, phoneNumber as an optional string for delivery contact, medicineName as a required string, quantity as a required number defaulting to 1, totalAmount as a required number in Indian Rupees, billingAddress as a required string, paymentStatus as a required enum with values pending, paid, or failed, paymentMode as a required enum with values cash, card, upi, or insurance, orderDate as a required date, deliveryByDate as an optional date, status as a required enum with values pending, confirmed, shipped, delivered, or cancelled, cancelledAt as an optional date, cancelReason as an optional string, rating as an optional number from 1 to 5, review as an optional string, reminderDate as an optional date, reminderSent as a required boolean, deliveryPartner as an optional string, deliveryStatus as a required enum with values pending, picked, in_transit, or delivered, and timestamps auto-generated.

Notification Model

The Notification model stores userId as a required string referencing the recipient, userName as an optional string, title as a required string, message as a required string, type as a required enum with values request, status_change, stock_update, or alert, isRead as a required boolean defaulting to false, relatedId as an optional string referencing related document, and createdAt auto-generated.

## 5. API Endpoints

Authentication Endpoints

POST /api/auth/register is used to register new user or pharmacy account. It does not require authentication. The request body must include name, email, password, and role.

POST /api/auth/login is used to authenticate user and receive JWT token. It does not require authentication. The request body must include email and password.

Medicine Endpoints

GET /api/medicines/search is used to search medicines by name or location. It does not require authentication. Query parameters include q for search term and location.

POST /api/medicines is used to add new medicine to inventory. It requires pharmacy token authentication. The request body must include name, genericName, manufacturer, price, stock, and location.

PUT /api/medicines/:id/stock is used to update medicine stock quantity. It requires pharmacy token authentication. The request body must include stock value.

DELETE /api/medicines/:id is used to remove medicine from inventory. It requires pharmacy token authentication.

GET /api/medicines/my-medicines/:pharmacyId is used to retrieve all medicines for a specific pharmacy. It requires pharmacy token authentication.

Request Endpoints

POST /api/requests is used to submit new medicine request. It requires user token authentication. The request body must include medicineName, userId, userName, urgency, billingAddress, and phoneNumber.

GET /api/requests/user/:userId is used to get all requests submitted by a user. It requires user token authentication.

GET /api/requests/all is used to get all requests from all users. It requires pharmacy token authentication.

PUT /api/requests/:id/status is used to approve or reject a medicine request. It requires pharmacy token authentication. The request body must include status value.

Order Endpoints

GET /api/orders is used to get all orders from all users. It requires pharmacy token authentication.

GET /api/orders/user/:userId is used to get orders for a specific user. It requires user token authentication.

GET /api/orders/user/:userId/filter is used to get orders for a user with status filtering. It requires user token authentication. Query parameter status can be used.

PUT /api/orders/:id/status is used to update order status. It requires pharmacy token authentication. The request body must include status value.

PUT /api/orders/:id/payment is used to update payment status. It requires pharmacy token authentication. The request body must include paymentStatus.

PUT /api/orders/:id/payment-mode is used to update payment method. It requires pharmacy token authentication. The request body must include paymentMode.

PUT /api/orders/:id/delivery-date is used to update expected delivery date. It requires pharmacy token authentication. The request body must include deliveryByDate.

PUT /api/orders/:id/update-details is used to update phone number or address. It requires user token authentication. The request body must include phoneNumber or billingAddress.

PUT /api/orders/:id/cancel is used to cancel an existing order. It requires user token authentication. The request body may include cancelReason.

PUT /api/orders/:id/rating is used to add rating and review for delivered order. It requires user token authentication. The request body must include rating and may include review.

PUT /api/orders/:id/reminder is used to set medicine reminder date. It requires user token authentication. The request body must include reminderDate.

PUT /api/orders/:id/delivery-partner is used to assign delivery partner to order. It requires pharmacy token authentication. The request body must include deliveryPartner.

PUT /api/orders/:id/delivery-status is used to update delivery tracking status. It requires pharmacy token authentication. The request body must include deliveryStatus.

Notification Endpoints

GET /api/notifications/:userId is used to get all notifications for a user. It requires user token authentication. It returns an array of notification objects.

GET /api/notifications/unread/:userId is used to get count of unread notifications. It requires user token authentication. It returns a count value.

PUT /api/notifications/:id/read is used to mark a single notification as read. It requires user token authentication. It returns a success message.

PUT /api/notifications/read-all/:userId is used to mark all notifications as read. It requires user token authentication. It returns a success message.

## 6. Authentication and Authorization

JWT tokens are generated upon successful login. The token contains the user ID and role. Tokens expire after 7 days.

The middleware folder contains the auth.js file which verifies JWT tokens. This middleware is applied to all protected routes.

Role-based access control is implemented in route handlers. Pharmacy-only endpoints check for role pharmacy. User-only endpoints check for role user.

Passwords are hashed using bcrypt with 10 salt rounds before storage. The compare method is used for password verification during login.

## 7. Notification System

When a patient submits a medicine request, notifications are created for all pharmacy users. Each notification contains the request details and urgency level.

When a pharmacy approves or rejects a request, a notification is created for the requesting patient.

When an order is confirmed, an email notification is sent to the patient using Nodemailer.

When payment is marked as paid, a notification is created for the patient.

When an order is cancelled, a notification is created for the patient with the cancellation reason.

Notifications are stored in the database with isRead flag defaulting to false. The frontend polls the unread count endpoint every 15 seconds.

## 8. Order Processing Flow

When a patient submits a medicine request, the request is saved with status pending.

Pharmacies receive notifications about new requests.

When a pharmacy approves a request, the request status changes to approved. An order is automatically created with status pending. The patient receives a notification.

The pharmacy can then update the order status through the workflow: pending to confirmed to shipped to delivered.

When the order status changes to confirmed, an email confirmation is sent to the patient.

The pharmacy can update payment status from pending to paid or failed.

The pharmacy can assign a delivery partner and update delivery tracking status.

The patient can cancel the order only when status is pending or confirmed. Cancellation requires a reason which is stored in the database.

After delivery, the patient can rate the order from 1 to 5 and add a review. Ratings and reviews are stored in the order document.

## 9. Installation Guide

Prerequisites

Node.js version 18 or higher must be installed. MongoDB Atlas account is required for cloud database hosting.

Steps

Clone the repository using git clone command. Navigate to the backend directory using cd command. Run npm install to install all dependencies.

Create a .env file in the backend directory with the following variables: MONGODB_URI for the database connection string, JWT_SECRET for token signing, and PORT for the server port.

Start the server using node server.js command.

The server will run on the specified port and display confirmation messages for successful database connection.

## 10. Environment Variables

MONGODB_URI stores the MongoDB Atlas connection string. Example value is mongodb+srv://username:password@cluster.mongodb.net/raremedicine.

JWT_SECRET stores the secret key for JWT signing. This should be a long random string.

PORT specifies the backend server port. Default value is 5000.

EMAIL_USER stores the email address for sending notifications. This is optional for Ethereal testing.

EMAIL_PASS stores the email password or app password. This is optional for Ethereal testing.

## 11. Error Handling

The API returns standard HTTP status codes for error conditions.

Status 200 indicates successful request completion.

Status 201 indicates successful resource creation.

Status 400 indicates bad request with missing or invalid data.

Status 401 indicates unauthorized access with missing or invalid token.

Status 403 indicates forbidden access with insufficient permissions.

Status 404 indicates requested resource not found.

Status 500 indicates internal server error.

All error responses include a message field describing the error. Console logging is implemented for debugging server-side errors.
]
## 12. Security Measures

Password Security

Bcrypt hashing with 10 salt rounds ensures passwords are stored securely. Plain text passwords are never stored in the database.

Token Security

JWT tokens expire after 7 days, requiring re-authentication. Tokens are sent in the Authorization header as Bearer tokens.

Input Validation

All request bodies are validated before database operations. Required fields are checked for presence. Data types are validated before insertion.

CORS Configuration

CORS is enabled to allow requests from the frontend application. The origin can be restricted to specific domains in production.

Environment Variables

Sensitive credentials are stored in .env files excluded from version control. Different environments can use different configuration files.

## 13. Deployment Guide

Deploy on Render.com

Push the code to a GitHub repository. Log into Render.com dashboard. Click New and select Web Service. Connect the GitHub repository. Set build command as npm install. Set start command as node server.js. Add environment variables in the Render dashboard. Click Deploy.

Post-Deployment

After deployment, the API base URL will be provided by the hosting platform. Update the frontend environment variable VITE_API_URL to point to this URL. The backend is now ready to serve API requests.



For GitHub issues, visit the repository issues page.
