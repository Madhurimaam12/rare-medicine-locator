## Rare Medicine Locator - Complete Project Documentation

## 1. Project Overview
Rare Medicine Locator is a full-stack web application developed to help patients find life-saving rare medicines. The platform connects patients with pharmacies that stock specialized medications. The application handles the complete workflow from medicine discovery to order delivery and feedback collection.
The system supports two primary user roles:
- Patients who need to find and request rare medicines
- Pharmacies who manage medicine inventory and process orders

## 2. Problem Statement
Patients with rare diseases face multiple challenges in obtaining necessary medications.
Medicines for rare diseases are not commonly stocked by retail pharmacies. Patients have no way to know which pharmacy carries which rare medicine. Life-saving medicines may only be available in specific cities or regions far from the patient's location. Delays in finding and procuring these medicines can have severe health consequences. There is no systematic mechanism for patients to request medicines that are currently unavailable.
Pharmacies face complementary challenges. They have difficulty connecting with patients who need specific rare medications. There is no platform to broadcast medicine availability to potential patients. Handling medicine requests manually is inefficient and error-prone. There is no centralized system for managing order status and delivery coordination.

## 3. Technology Stack

Backend Technologies
Node.js version 18 serves as the JavaScript runtime environment for server-side execution. Express.js version 4.18 is the web framework used for building RESTful APIs and handling HTTP requests. MongoDB Atlas version 6.0 provides cloud-based NoSQL database for data persistence. Mongoose version 7.3 serves as the Object Data Modeling library for schema definition and validation. JSON Web Token version 9.0 handles token-based authentication and authorization. Bcryptjs version 2.4 performs password hashing for secure credential storage. Nodemailer version 6.9 handles email transmission for order confirmations and notifications.

Frontend Technologies
React version 18.2 is the component-based UI library for building interactive interfaces. Vite version 4.4 serves as the build tool providing fast development server and optimized production builds. React Router DOM version 6.14 handles client-side routing for navigation between pages. Axios version 1.4 is the HTTP client for making API requests to the backend. Bootstrap version 5.3 provides the responsive grid system and pre-built components for styling. React Hot Toast version 2.4 delivers toast notifications for non-intrusive user alerts. Recharts version 2.7 provides charting library for data visualization in the analytics dashboard. html2pdf.js version 0.10 handles PDF generation for invoice downloads. XLSX version 0.18 processes Excel files for bulk upload and export functionality.

## 4. Features
Patient Features
Medicine Search allows patients to search for medicines by name with real-time suggestions. The search includes debounced input with 500 millisecond delay and case-insensitive matching.
Category Browsing organizes medicines into therapeutic categories including Gene Therapy, Enzyme Replacement, Metabolic Disorders, Cancer Therapy, and SMA Treatment.
Medicine Comparison enables side-by-side comparison of up to three medicines showing price, manufacturer, stock status, and location.
Request Submission allows patients to submit medicine requests with urgency specification. Three urgency levels are available: Normal for 3 to 5 days, High for 1 to 2 days, and Urgent for within 24 hours.
Order Tracking provides a visual timeline showing order progress from Requested to Confirmed to Shipped to Delivered with progress indicators.
Order Management enables editing of phone number, billing address, and payment mode with inline editing and save or cancel options.
Order Cancellation allows patients to cancel pending or confirmed orders with an optional reason field. A confirmation dialog appears before cancellation.
Rating and Review enables patients to rate delivered orders on a 5-point scale with descriptive labels including Poor, Fair, Good, Very Good, and Excellent. An optional text review field is provided.
Medicine Reminder allows patients to set future reminder dates for medicine refills using a date picker that prevents past dates.
Invoice Download generates PDF invoices for completed orders including complete order details, pricing, and delivery information.
Favorite Medicines allows patients to save medicines to a personal favorites list with localStorage persistence across sessions.
Share Medicine enables sharing of medicine details using the device share functionality through Web Share API integration.
Dark Mode allows toggling between light and dark color themes using CSS variables with Context API and preference saved to localStorage.
Pharmacy Features
Analytics Dashboard provides visual representation of business metrics including a bar chart for orders per day and a pie chart for payment distribution.
Inventory Management enables complete CRUD operations for the medicine catalog with form validation for all fields and real-time inventory updates.
Stock Management allows updating medicine stock quantities through prompt-based input with numeric validation.
Low Stock Alerts automatically highlight medicines with stock less than or equal to five units with a warning banner at dashboard top and individual medicine highlighting.
Bulk Upload allows uploading multiple medicines via Excel or CSV files using XLSX library for file parsing with error handling for malformed rows.
Request Processing enables approving or rejecting patient medicine requests with one-click approval or rejection and automatic notification generation.
Order Status Management allows updating order status through the complete workflow with options including Pending, Confirmed, Shipped, Delivered, and Cancelled.
Payment Status Management allows updating payment status for orders with options including Pending, Paid, and Failed.
Delivery Partner Assignment allows assigning courier services to orders with options including Bluedart, Delhivery, DTDC, Ekart, and Xpressbees.
Delivery Tracking allows updating delivery status throughout the shipment process with options including Pending, Picked Up, In Transit, and Delivered.
Order Export allows downloading all orders as an Excel spreadsheet with complete data export including all order fields.
Customer Insights allows viewing customer details and complete order history through a modal popup with personal information and order history table.
Rating Visibility allows viewing patient-submitted ratings and reviews with star display and review text truncation for long entries.

## 5. Database Schema
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

## 6. API Endpoints

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

## 7. Installation Guide

Prerequisites
Node.js version 18 or higher must be installed on the system. A MongoDB Atlas account is required for cloud database hosting. Git must be installed for version control. A GitHub account is needed for remote repository hosting.

Backend Installation
First, clone the repository using the git clone command followed by the repository URL. Navigate to the backend directory using the cd command. Run npm install to install all backend dependencies. Create a .env file in the backend directory to configure environment variables. Start the backend server using the node server.js command.

Frontend Installation
Navigate to the frontend directory using the cd command. Run npm install to install all frontend dependencies. Start the development server using the npm run dev command.

Environment Variables
The MONGODB_URI variable stores the MongoDB Atlas connection string. The JWT_SECRET variable stores the secret key for JWT signing. The PORT variable specifies the backend server port.

## 8. Security Implementation

Password Protection
Bcrypt hashing with 10 salt rounds is used to hash passwords before storing them in the database. This prevents password exposure in case of database breach.

Authentication
JWT tokens with 7-day expiration are generated upon successful login. These tokens verify user identity for protected routes.

Authorization
Role-based access control restricts actions based on user role. Patients cannot access pharmacy-only endpoints and vice versa.

Token Validation
Middleware verification is implemented on all protected routes. This ensures only authenticated requests proceed to the controllers.

Input Sanitization
Request body validation is performed before database operations. This prevents injection attacks and ensures data integrity.

CORS Configuration
Cross-origin requests are restricted to control which domains can access the API. This prevents unauthorized access from malicious websites.

Environment Variables
Sensitive data including database credentials and JWT secrets are stored in .env files. This prevents hardcoding of credentials in source code.

## 9. Deployment Instructions

Backend Deployment on Render.com
Push the code to a GitHub repository. Log into the Render.com dashboard. Click the New button and select Web Service. Connect your GitHub repository. Configure the build command as npm install and the start command as node server.js. Add environment variables in the Render dashboard. Click Deploy.

Frontend Deployment on Vercel
Push the code to a GitHub repository. Log into the Vercel dashboard. Click Import Project. Connect your GitHub repository. Set the build command as npm run build. Set the output directory as dist. Click Deploy.

## 10. Testing Instructions

Backend Testing
To test user registration, send a POST request to the /api/auth/register endpoint with user data. The expected result is status 201 with a success message.
To test user login, send a POST request to the /api/auth/login endpoint with credentials. The expected result is status 200 with a JWT token received.
To test medicine search, send a GET request to the /api/medicines/search endpoint with a query parameter. The expected result is status 200 with an array of medicines.
To test adding medicine, send a POST request to the /api/medicines endpoint with a pharmacy token. The expected result is status 201 with a medicine object returned.
To test order creation, have a pharmacy approve a request. The expected result is an order automatically created with a database entry present.

Frontend Testing

To test registration, navigate to the Register page, fill the form, and submit. The expected result is a success message and redirect to login.
To test login, enter credentials and click Login. The expected result is redirect to Home page with token stored in localStorage.
To test medicine search, type a medicine name in the search bar. The expected result is suggestions appearing and results displaying.
To test request submission, click the Request button on a medicine card. The expected result is redirect to request page with form prefilled.
To test order tracking, navigate to the My Orders page. The expected result is order timeline visible with progress indicators.

## 11. Known Limitations

Real-time updates currently use polling every 15 seconds instead of WebSockets. This will be improved by implementing Socket.io for instant updates.
Payment gateway integration is not currently implemented. This will be added by integrating Razorpay or Stripe API.
Prescription upload functionality is not available. This will be added with file upload feature using Cloudinary.
The application is web-only at present. A mobile application will be developed using React Native.
Notifications are currently email-only. 

## 12. Acknowledgments

MongoDB Atlas for providing free cloud database hosting. The Node.js and React open source communities for their contributions. Bootstrap for the responsive design framework. All contributors and testers who helped validate the application.
