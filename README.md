🏨 BookMyStay Backend API

A scalable and secure backend for a hotel booking platform inspired by real-world systems like OYO/Booking.com. 
This project is built using Node.js, Express.js, and MongoDB, focusing on clean architecture, role-based access, and production-level API design.

🚀 Features

👤 User Features
User Registration & Authentication (JWT-based)
Login & Logout functionality
View user profile
Search hotels with filters
Book hotel rooms
View current bookings
Cancel bookings
Booking history tracking

🏢 Owner Features
Owner Registration & Authentication
Manage hotel bookings
View user details per booking
Check-in / Check-out system
Update available rooms
View booking history

🔐 Authentication & Security
JWT-based authentication for both users and owners
Protected routes using middleware
Role-based access control (User / Owner)

📦 API Endpoints
👤 User APIs
Method	Endpoint	Description
POST	/createUser	Register a new user
POST	/userlogin	Login user
POST	/userlogout	Logout user
GET	/userProfile	Get user profile
POST	/bookHotel	Book a hotel
GET	/getMyBookings	Get current bookings
POST	/cancelBooking	Cancel a booking
GET	/searchHotels	Search available hotels
GET	/getMyBookingHistory	Get booking history

🏢 Owner APIs
Method	Endpoint	Description
POST	/createOwner	Register a new owner
POST	/ownerlogin	Login owner
POST	/ownerlogout	Logout owner
POST	/ownerProfile/:bookingId	View owner profile/details
POST	/checkIn/:bookingId	Mark check-in
POST	/checkOut/:bookingId	Mark check-out
POST	/seeBookings	View all bookings
POST	/seeUserDetails/:bookingId	View user details for a booking
POST	/updateAvailableRooms	Update room availability
GET	/getOwnerBookingHistory	Owner booking history

🧠 Core Functionalities

📅 Booking System
Prevents double booking of rooms
Tracks booking status (Booked, Checked-in, Checked-out, Cancelled)
Maintains booking lifecycle

🔄 Check-In / Check-Out Flow
Owners can manage guest lifecycle
Updates booking status in real-time

🔍 Hotel Search
Dynamic search based on availability
Scalable query handling using MongoDB

📊 Booking History
Separate history tracking for users and owners
Useful for analytics and reporting

🛠️ Tech Stack
Node.js
Express.js
MongoDB
JWT Authentication

📁 Project Structure (Simplified)
project-root/
│── controllers/
│── routes/
│── models/
│── middleware/
│── config/
│── utils/
│── app.js
│── server.js

⚙️ Installation & Setup

git clone <repository-url>
cd project-folder
npm install

Create a .env file:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run the server:
npm run dev

📌 Highlights
Designed and developed a full-featured hotel booking backend with role-based access control
Implemented secure JWT authentication for users and owners
Built a complete booking lifecycle system including check-in/check-out management
Optimized database queries for hotel search and booking operations
Developed scalable REST APIs following industry best practices

🧑‍💻 Author
Abhinav Tiwari
