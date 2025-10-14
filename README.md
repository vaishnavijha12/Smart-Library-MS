# 📚 Smart Library Management System (Smart LMS)

A **smart, responsive, and automated Library Management System** built with **Next.js**, **Prisma**, **PostgreSQL**, and **TypeScript**.  
Designed for modern educational institutions to simplify **book management, fine payments, and QR-based issuing** with real-time dashboards for both students and librarians.

---

## 🚀 Tech Stack

| Technology | Description |
|-------------|-------------|
| **Next.js 14 (App Router)** | React framework with server-side rendering |
| **TypeScript** | Strict typing for scalable and bug-free code |
| **Prisma ORM** | Type-safe ORM for PostgreSQL |
| **PostgreSQL** | Robust relational database |
| **Tailwind CSS** | Responsive utility-first CSS framework |
| **JWT Authentication** | Secure authentication and authorization |
| **PhonePe API** | Payment gateway integration for fine payments |

---

## ✨ Features

- 🔹 QR Code based **Book Issue & Return**
- 🔹 **Fine Payment Integration** using PhonePe API
- 🔹 **Role-based Dashboards** for Students and Librarians
- 🔹 **Real-time Reports** for issued, returned, and overdue books
- 🔹 **Advanced Search and Filters**
- 🔹 **Fully Normalized Database Schema**
- 🔹 **Secure JWT-based Authentication**
- 🔹 **Responsive UI** using Tailwind CSS

---

## ⚙️ Complete Setup Guide

Follow these instructions **step-by-step** to set up and run the Smart LMS project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/smart-lms.git
cd smart-lms

2️⃣ Install Dependencies

Using npm or yarn to install all required packages:

npm install
# OR
yarn install

3️⃣ Set Up PostgreSQL Database

Open your PostgreSQL shell or GUI tool (like DBeaver, Postico, or pgAdmin) and create a new database:

CREATE DATABASE smart_lms_db;

4️⃣ Configure Environment Variables

Create a .env.local file in the project root directory by copying the example file:

cp .env.example .env.local


Now open .env.local and add your credentials:

# PostgreSQL Database URL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/smart_lms_db"

# JWT Secret for token signing
JWT_SECRET=your_super_strong_jwt_secret

# Node environment
NODE_ENV=development

# Payment Gateway (PhonePe)
MERCHANT_BASE_URL=
MERCHANT_STATUS_URL=
MERCHANT_KEY=
MERCHANT_ID=

# Custom Encryption (if applicable)
ENCRYPTION_SECRET=super_secret_passphrase
IV_LENGTH=16

5️⃣ Run Prisma Migrations

Use Prisma ORM to create database tables and schema automatically.

npx prisma migrate dev


If you make schema changes later, regenerate the Prisma client:

npx prisma generate

6️⃣ Run the Development Server

Start your local development server:

npm run dev


The application will start at:

http://localhost:3000