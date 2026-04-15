# 🚀 Task Tracker Application

This project is a cloud-based Task Tracker application developed using React (frontend), Node.js (backend), and AWS services such as DynamoDB, SNS, SQS, and S3.

The purpose of this application is to demonstrate DevOps practices (CI/CD) and integration of multiple AWS cloud services in a real-world scenario.

---

# 📌 Prerequisites (Before You Start)

Please make sure the following are installed on your system:

1. **Node.js (Required)**

   * Download from: https://nodejs.org/
   * Install the LTS version

2. **Git (Optional but recommended)**

   * Download from: https://git-scm.com/

---

# 📁 Project Structure

```
Task-Tracker/
│
├── backend/        → Node.js backend (API + AWS integration)
├── frontend/       → React frontend (User Interface)
└── README.md
```

---

# ⚙️ STEP 1 — Download the Project

### Option 1: Using Git

```bash
git clone https://github.com/BharatSharma29/Task-Tracker
cd Task-Tracker
```

### Option 2: Download ZIP

* Download ZIP from GitHub
* Extract it
* Open the folder in your system

---

# ⚙️ STEP 2 — Setup Backend

Open terminal and navigate to backend folder:

```bash
cd backend
```

---

## 📌 Install dependencies

```bash
npm install
```

---

## 📌 Create `.env` file

Inside the `backend` folder, create a file named `.env` and paste:

```
PORT=5001
JWT_SECRET=mysecretkey

AWS_ACCESS_KEY_ID=YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET
AWS_SESSION_TOKEN=YOUR_TOKEN

SNS_TOPIC_ARN=your_sns_topic
SQS_QUEUE_URL=your_sqs_url
S3_BUCKET_NAME=your_bucket_name
```

👉 Replace values with your AWS credentials

---

## 📌 Run backend server

```bash
node server.js
```

You should see:

```
Server running on port 5001
```

---

# ⚙️ STEP 3 — Setup Frontend

Open another terminal:

```bash
cd frontend
```

---

## 📌 Install dependencies

```bash
npm install
```

---

## 📌 Run frontend

```bash
npm start
```

---

## 🌐 Application will open at:

```
http://localhost:3000
```

---

# 🧪 STEP 4 — Test the Application

1. Register a new user
2. Login
3. Create a task
4. Update or delete tasks

---

# ☁️ AWS SERVICES USED

This application uses:

* Amazon EC2 → Hosting
* Amazon DynamoDB → Database
* Amazon SNS → Email notifications
* Amazon SQS → Queue system
* Amazon S3 → File storage

---

# 🔄 CI/CD PIPELINE

GitHub Actions is used for CI/CD.

Whenever code is pushed:

* Dependencies are installed
* Code is checked using ESLint
* Security scan using npm audit
* Application is built
* Automatically deployed to EC2

---

# ⚠️ IMPORTANT NOTES

* AWS credentials may expire (if using student lab)
* If application stops working, update `.env` file
* Make sure correct AWS region is used (`us-east-1`)

---

# 🧠 Troubleshooting

### Backend not starting?

* Check if Node.js is installed
* Run `npm install` again

### Frontend not loading?

* Ensure backend is running
* Check correct API URL

### AWS not working?

* Check credentials in `.env`
* Ensure they are not expired

---

# 📌 Summary

This project demonstrates:

* Full-stack development
* DevOps CI/CD pipeline
* Integration of multiple AWS services
* Real-world cloud application deployment

---

# 👨‍💻 Author

Developed as part of a Master's level coursework project.
