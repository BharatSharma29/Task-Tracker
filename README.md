# Task Tracker Application

This is a cloud-based Task Tracker application with authentication and role-based access control.

## Features
- User registration and login
- Role-based access (Admin and User)
- Create, view, update, delete tasks

---

## Requirements
- Node.js installed
- MySQL database (AWS RDS recommended)

---

## Setup Instructions

1. Clone the repository

2. Go to backend folder:
cd backend

3. Install dependencies:
npm install

4. Create a .env file and add:

PORT=5000
DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=tasktracker
JWT_SECRET=mysecretkey

---

## Database Setup

Run the following SQL:

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255),
password VARCHAR(255),
role VARCHAR(50)
);

CREATE TABLE tasks (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
description TEXT,
status VARCHAR(50),
user_id INT
);

---

## Run the Application

node server.js

---

## API Endpoints

POST /api/auth/register  
POST /api/auth/login  
GET /api/tasks  
POST /api/tasks  
PUT /api/tasks/:id  
DELETE /api/tasks/:id  

---

## Notes

- Admin users can delete tasks
- Regular users can only manage their own tasks