# Rare Medicine Locator - Frontend Documentation

## 1. Frontend Overview

The frontend of Rare Medicine Locator is a single-page application built with React 18 and Vite. It provides separate interfaces for patients and pharmacies with distinct functionalities. The application communicates with the backend API through HTTP requests and handles real-time updates through polling. The interface is fully responsive and supports dark mode theming.

## 2. Technology Stack

React version 18.2 is the component-based UI library for building interactive interfaces.

Vite version 4.4 serves as the build tool providing fast development server and optimized production builds.

React Router DOM version 6.14 handles client-side routing for navigation between pages.

Axios version 1.4 is the HTTP client for making API requests to the backend.

Bootstrap version 5.3 provides the responsive grid system and pre-built components for styling.

React Hot Toast version 2.4 delivers toast notifications for non-intrusive user alerts.

Recharts version 2.7 provides charting library for data visualization in the analytics dashboard.

html2pdf.js version 0.10 handles PDF generation for invoice downloads.

XLSX version 0.18 processes Excel files for bulk upload and export functionality.

AOS version 2.3 provides scroll animations for the landing page.

## 3. Folder Structure

The src folder contains all application source code.

The components folder contains reusable UI components organized by feature. The dashboard subfolder contains dashboard-specific components including StatisticsCards, LowStockAlert, MedicineList, RequestsList, and CustomerDetailsModal. Other components include NotificationBell for the notification system and MedicineCompare for medicine comparison functionality.

The pages folder contains page-level components including Landing, Login, Register, Home, Dashboard, MyOrders, PharmacyOrders, and Requests.

The context folder contains ThemeContext for managing dark mode state across the application.

The utils folder contains helper functions including pdfGenerator for invoice generation.

The data folder contains static data files including medicineDetails for medicine information and pharmacyDetails for pharmacy contact information.

The App.jsx file is the main application component with routing configuration.

The main.jsx file is the application entry point with theme provider and toast container setup.

The index.css file contains global styles and dark mode CSS variables.

## 4. Page Components

Landing Page

The Landing page serves as the marketing entry point for visitors. It includes a hero section with call-to-action buttons, statistics displaying platform metrics, a how-it-works section explaining the three-step process, featured medicines display, user testimonials with ratings, frequently asked questions accordion, and contact information with quick links. The page supports dark mode through CSS variables.

Login Page

The Login page provides authentication for existing users. It includes email and password input fields with validation. Upon successful login, the JWT token and user details are stored in localStorage. The user is redirected to the Home page. Error messages are displayed for invalid credentials.

Register Page

The Register page allows new users to create accounts. It includes name, email, password, and role selection fields. Role options include Patient User and Pharmacy Hospital. Upon successful registration, a success message is displayed and the user is redirected to the Login page.

Home Page

The Home page is the primary interface for patients to search and request medicines. It includes a search bar with autocomplete suggestions, location filter dropdown, medicine categories browsing, popular searches buttons, medicine comparison button, and search results display. Each medicine card displays the medicine name, generic name, manufacturer, location, price, stock status badge, favorite button, request button, share button, and view details button. The page includes debounced search with 500 millisecond delay to reduce API calls.

Dashboard Page

The Dashboard page is the primary interface for pharmacies. It includes statistics cards showing total medicines, total orders, total revenue, and pending approvals. A low stock alert banner appears when medicines have stock less than or equal to five. A bar chart displays orders per day using Recharts. A pie chart displays payment status distribution. Action buttons allow adding new medicines and exporting orders to Excel. The page includes an add medicine form, a list of all medicines with stock update functionality, and a list of patient requests with approve and reject buttons.

My Orders Page

The My Orders page displays all orders for the logged-in patient. It includes a status filter dropdown to filter orders by pending, confirmed, shipped, delivered, or cancelled. Each order card displays the medicine name, order ID, order timeline with progress indicators, total amount, phone number with edit option, billing address, payment status badge, payment mode dropdown, delivery by date, and order date. Action buttons include download invoice, rate order for delivered orders, set reminder, and cancel order for pending or confirmed orders. A rating modal appears when rating an order with buttons for ratings 1 to 5 and a review text area. A reminder modal appears when setting a reminder with a date picker.

Pharmacy Orders Page

The Pharmacy Orders page displays all orders for the logged-in pharmacy. It includes a status filter dropdown and an export to Excel button. The orders table displays order ID, patient name, phone number, medicine name, amount, billing address, payment status, payment mode dropdown, delivery by date, order status dropdown with pending, confirmed, shipped, delivered, and cancelled options, rating display with stars and review text, delivery partner dropdown with options including Bluedart, Delhivery, DTDC, Ekart, and Xpressbees, delivery status dropdown with options including pending, picked up, in transit, and delivered, and action buttons for editing order details and updating payment status. Cancelled orders display the cancellation reason.

Requests Page

The Requests page allows patients to submit medicine requests. It includes a form with medicine name field, phone number field with validation, billing address text area, and urgency level dropdown with normal, high, and urgent options. The page also displays a list of the patient's previous requests with status badges.

## 5. Components

NotificationBell Component

The NotificationBell component displays a bell icon in the navigation bar. It fetches unread notification count from the backend and displays a badge with the count. Clicking the bell opens a dropdown list of all notifications. Each notification shows the title, message, and timestamp. Unread notifications have a New badge. The component includes mark as read functionality for individual notifications and mark all as read functionality. It polls for new notifications every 15 seconds.

MedicineCompare Component

The MedicineCompare component displays a modal for comparing up to three medicines. It receives an array of medicines as a prop. Users can select medicines to compare by clicking buttons. The comparison table shows generic name, manufacturer, price, stock status, and location for each selected medicine. The modal includes a close button.

StatisticsCards Component

The StatisticsCards component displays four statistics cards on the pharmacy dashboard. It receives medicines count, total orders count, total revenue amount, and pending approvals count as props. Each card has a colored background and displays the statistic value and label.

LowStockAlert Component

The LowStockAlert component displays a warning banner when medicines have low stock. It receives an array of low stock medicines as a prop. The banner lists each medicine name and remaining stock quantity. The component returns null when no low stock medicines exist.

MedicineList Component

The MedicineList component displays the pharmacy's medicines in a list format. It receives medicines array and onUpdateStock callback as props. Each list item shows medicine name, manufacturer, price, location, and stock quantity. A low stock badge appears when stock is five or less. An out of stock badge appears when stock is zero. An update stock button triggers the onUpdateStock callback with medicine ID and current stock.

RequestsList Component

The RequestsList component displays patient requests on the pharmacy dashboard. It receives requests array, onApprove callback, onReject callback, and onViewCustomer callback as props. Each list item shows medicine name, patient name, urgency badge, status badge, and billing address. Pending requests display approve and reject buttons. A view customer details button opens the customer details modal.

CustomerDetailsModal Component

The CustomerDetailsModal component displays customer information in a modal. It receives customer object and onClose callback as props. The modal shows personal information including name, user ID, email, and request date. It shows request information including medicine, urgency, status, and address. It displays order history summary including total orders and total spent. It shows a table of all orders with order ID, medicine name, amount, status, and date.

AddMedicineForm Component

The AddMedicineForm component provides a form for pharmacies to add new medicines. It receives onSubmit and onCancel callbacks as props. The form includes fields for medicine name, generic name, manufacturer, price, stock quantity, and location. All fields except generic name are required. Form submission triggers the onSubmit callback with the medicine data.

SearchBar Component

The SearchBar component provides the search interface on the Home page. It receives searchTerm, onSearchChange, location, onLocationChange, onManualSearch, loading, sortBy, and onSortChange as props. The component includes a medicine name input field, location dropdown with major Indian cities, search button, and sort by dropdown with name, price low to high, price high to low, and stock availability options.

CategoriesSection Component

The CategoriesSection component displays medicine categories on the Home page. It receives categories array and onCategoryClick callback as props. The component renders each category as a card with category name and list of medicine buttons. Clicking a medicine button triggers the onCategoryClick callback with the medicine name.

ViewDetailsModal Component

The ViewDetailsModal component displays detailed medicine information in a modal. It receives medicine object, onClose callback, and onRequest callback as props. The modal shows description, uses, mechanism of action, common side effects, and dosage information. It also shows generic name, manufacturer, price, stock status, and pharmacy contact information. The modal includes a request this medicine button.

## 6. State Management

Local Component State

The useState hook manages component-specific state including form inputs, UI visibility flags, and loading states. Each component maintains its own state independently.

Effect Hooks

The useEffect hook handles side effects including data fetching on component mount, setting up polling intervals, and cleaning up resources on component unmount.

Callback Hooks

The useCallback hook memoizes functions to prevent unnecessary re-renders. This is particularly useful for search functions passed to child components.

Ref Hooks

The useRef hook stores mutable values that persist across renders without causing re-renders. This is used for debounce timeouts and DOM references.

Context API

The ThemeContext provides dark mode state to all components. The context includes darkMode boolean and toggleDarkMode function. The ThemeProvider wraps the entire application.

LocalStorage

LocalStorage persists user authentication data including JWT token, user ID, user name, user email, and user role. It also persists dark mode preference and favorite medicines list.

## 7. Routing Configuration

The App component uses BrowserRouter from React Router DOM for client-side routing.

The landing route at path landing renders the Landing page for unauthenticated visitors.

The login route at path login renders the Login page.

The register route at path register renders the Register page.

The home route at path root renders the Home page for authenticated users. Unauthenticated users are redirected to landing.

The dashboard route at path dashboard renders the Dashboard page only for users with pharmacy role. Unauthenticated users or patients are redirected to home.

The requests route at path requests renders the Requests page for authenticated users.

The my-orders route at path my-orders renders the MyOrders page for authenticated users.

The pharmacy-orders route at path pharmacy-orders renders the PharmacyOrders page only for users with pharmacy role.

Token validation runs on every route change. Expired tokens trigger logout and redirect to landing.

## 8. Dark Mode Implementation

CSS variables define colors for light and dark themes. Variables include bg for background color, text for text color, border for border color, code-bg for code block backgrounds, and accent for accent color.

The ThemeContext provides dark mode state to all components. The darkMode boolean indicates current theme. The toggleDarkMode function switches between themes.

When dark mode is enabled, the dark class is added to the HTML root element. This class triggers the dark theme CSS variables.

The dark mode preference is saved to localStorage and persists across page reloads.

Bootstrap components are overridden with dark mode styles using CSS variable references.

All pages and components use the CSS variables for colors, ensuring consistent theming across the application.

## 9. API Integration

The Axios instance is configured with a base URL pointing to the backend API. An interceptor adds the JWT token to the Authorization header for all requests.

Request functions use async await syntax for handling asynchronous operations. Try catch blocks handle errors and display toast notifications.

GET requests fetch data from the backend. POST requests submit new data. PUT requests update existing data. DELETE requests remove data.

Search requests are debounced with a 500 millisecond delay to reduce API calls. The debounce timeout is cleared on each keystroke and set only after typing stops.

Polling is implemented for real-time updates. The My Orders page polls for order updates every 15 seconds. The NotificationBell polls for notification count every 15 seconds.

## 10. Form Validation

Login and registration forms validate that fields are not empty. Email format is validated using browser input type email.

Medicine request forms validate phone number to ensure it is not empty. Billing address is validated to ensure it is not empty.

Add medicine forms validate that all required fields are filled. Price and stock values must be positive numbers.

Rating forms validate that a rating between 1 and 5 is selected before submission.

Reminder forms validate that a future date is selected before submission.

All validation errors are displayed using toast notifications.

## 11. Error Handling

Network errors are caught and displayed as toast notifications. Users are prompted to check their internet connection.

Authentication errors redirect users to the login page with an appropriate message.

Form validation errors prevent submission and display specific error messages.

API error responses are parsed and displayed to users with the error message from the backend.

Console error logging is implemented for debugging purposes in development mode.

## 12. Performance Optimizations

Code splitting is implemented using React.lazy for route-based code splitting. This reduces initial bundle size.

Debouncing is implemented for search input with a 500 millisecond delay. This reduces API calls and improves performance.

Memoization is implemented using useCallback and useMemo hooks. This prevents unnecessary re-renders of child components.

Image lazy loading is implemented for medicine images. Images load only when they enter the viewport.

Polling intervals are cleared on component unmount to prevent memory leaks.

## 13. Installation Guide

Prerequisites

Node.js version 18 or higher must be installed. The backend server must be running on port 5000.

Steps

Navigate to the frontend directory using the cd command. Run npm install to install all dependencies.

Create a .env file in the frontend directory with VITE_API_URL pointing to the backend API URL.

Run npm run dev to start the development server.

The application will open at http://localhost:5173.

Build for Production

Run npm run build to create a production build. The build artifacts will be generated in the dist directory.

## 14. Environment Variables

VITE_API_URL stores the backend API base URL. In development, this is http://localhost:5000. In production, this is the deployed backend URL.

## 15. Deployment Guide

Deploy on Vercel

Push the code to a GitHub repository. Log into Vercel dashboard. Click Import Project. Connect the GitHub repository. Set the build command as npm run build. Set the output directory as dist. Add the VITE_API_URL environment variable. Click Deploy.

## 16. Testing Instructions

Open the browser developer tools to monitor network requests and console logs.

Test registration by creating a new user account. Verify that the account appears in the MongoDB users collection.

Test login by using the registered credentials. Verify that the JWT token is stored in localStorage.

Test medicine search by typing medicine names. Verify that autocomplete suggestions appear and search results display.

Test medicine request by clicking request on a medicine card. Fill the form and submit. Verify that the request appears in the pharmacy dashboard.

Test order tracking by logging in as pharmacy and approving a request. Verify that the order appears in the patient's My Orders page with correct timeline.

Test dark mode by clicking the dark mode toggle button. Verify that colors change across all pages.

Test PDF download by clicking download invoice on a delivered order. Verify that the PDF file downloads with correct order details.

Test Excel export by clicking export orders on the pharmacy dashboard. Verify that the Excel file downloads with all order data.

