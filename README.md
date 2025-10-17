# 📚 Smart Library Management System (Smart LMS)

A **smart, responsive, and automated Library Management System** built with **Next.js**, **Prisma**, **PostgreSQL**, and **TypeScript**.  
Designed for modern educational institutions to simplify **book management, fine payments, and QR-based issuing** with real-time dashboards for both students and librarians.

---

## 🚀 Tech Stack

| Technology | Description |
|-------------|-------------|
| **Next.js 15 (App Router)** | React framework with server-side rendering |
| **TypeScript** | Strict typing for scalable and bug-free code |
| **Prisma ORM** | Type-safe ORM for PostgreSQL |
| **PostgreSQL** | Robust relational database |
| **Tailwind CSS** | Responsive utility-first CSS framework |
| **JWT Authentication** | Secure authentication and authorization |
| **PhonePe API** | Payment gateway integration for fine payments |
| **Cloudinary** | Cloud-based image and media management |

---

## ✨ Features

- 🔹 QR Code based **Book Issue & Return**
- 🔹 **Fine Payment Integration** using PhonePe API
- 🔹 **Role-based Dashboards** for Students and Librarians
- 🔹 **Real-time Reports** for issued, returned, and overdue books
- 🔹 **Advanced Search and Filters**
- 🔹 **Fully Normalized Database Schema**
- 🔹 **Secure JWT-based Authentication**
- 🔹 **Cloud Image Storage** with Cloudinary
- 🔹 **Responsive UI** using Tailwind CSS

---

## ⚙️ Complete Setup Guide

Follow these instructions **step-by-step** to set up and run the Smart LMS project locally.

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/smart-lms.git
cd smart-lms
```

---

### 2️⃣ Install Dependencies

Using npm or yarn to install all required packages:
```bash
npm install
# OR
yarn install
```

---

### 3️⃣ Set Up PostgreSQL Database

Open your PostgreSQL shell or GUI tool (like DBeaver, Postico, or pgAdmin) and create a new database:
```sql
CREATE DATABASE smart_lms_db;
```

---

### 4️⃣ Set Up Cloudinary Account

Cloudinary is used to store and manage book cover images and user profile pictures.

#### Steps to get Cloudinary credentials:

1. **Create a free account** at [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)

2. **Verify your email** and log in to the Cloudinary Dashboard

3. **Navigate to the Dashboard** - After logging in, you'll see your account details at the top

4. **Copy the following credentials** from your Dashboard:
   - **Cloud Name** (e.g., `dxxxxxxxxxxxxx`)
   - **Upload Preset** (e.g., `smart_lms_preset`)


5. **Create an Upload Preset** (Optional but recommended):
   - Go to **Settings** → **Upload** → **Upload presets**
   - Click **Add upload preset**
   - Set **Signing Mode** to `Unsigned`
   - Set **Folder** to something like `smart-lms` (optional)
   - Copy the **Upload Preset Name** (e.g., `smart_lms_preset`)

---

### 5️⃣ Configure Environment Variables

Create a `.env.local` file in the project root directory by copying the example file:
```bash
cp .env.example .env.local
```

Now open `.env.local` and add your credentials:
```env
# PostgreSQL Database URL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/smart_lms_db"

# JWT Secret for token signing
JWT_SECRET=your_super_strong_jwt_secret

# Node environment
NODE_ENV=development

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Payment Gateway (PhonePe)
MERCHANT_BASE_URL=
MERCHANT_STATUS_URL=
MERCHANT_KEY=
MERCHANT_ID=

# Custom Encryption (if applicable)
ENCRYPTION_SECRET=super_secret_passphrase
IV_LENGTH=16
```

**Important Notes:**
- Replace `your_cloud_name`, `your_api_key`, `your_api_secret`, and `your_upload_preset` with your actual Cloudinary credentials
- The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser
- Keep your `CLOUDINARY_API_SECRET` secure and never commit it to version control

---

### 6️⃣ Run Prisma Migrations

Use Prisma ORM to create database tables and schema automatically.
```bash
npx prisma migrate dev
```

If you make schema changes later, regenerate the Prisma client:
```bash
npx prisma generate
```

---

### 7️⃣ Run the Development Server

Start your local development server:
```bash
npm run dev
```

The application will start at:
```
http://localhost:3000
```

---

## 📸 Cloudinary Usage in the Application

### Image Upload Features:

1. **Book Cover Images**
   - Librarians can upload book cover images when adding new books
   - Images are automatically optimized and stored in Cloudinary
   - Supports JPG, PNG, and WebP formats

2. **User Profile Pictures**
   - Students and librarians can upload profile pictures
   - Automatic image resizing and optimization
   - Secure URL generation for displaying images

3. **QR Code Storage**
   - Generated QR codes for books are stored in Cloudinary
   - Easy retrieval and display in the application

### Image Optimization:
- Automatic format conversion to WebP for better performance
- Responsive image delivery based on device size
- CDN-based delivery for faster loading times

---

## 🔒 Security Best Practices

- Never commit your `.env.local` file to version control
- Add `.env.local` to your `.gitignore` file
- Use strong, unique values for `JWT_SECRET` and `ENCRYPTION_SECRET`
- Keep your Cloudinary API credentials secure
- Regularly rotate your API keys and secrets

---

## 📝 Additional Configuration

### Optional Cloudinary Settings:

You can customize Cloudinary behavior by adding these optional variables to `.env.local`:
```env
# Optional: Cloudinary folder structure
CLOUDINARY_FOLDER=smart-lms

# Optional: Maximum file size (in bytes, default: 5MB)
MAX_FILE_SIZE=5242880

# Optional: Allowed file formats
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp
```

---

## 🐛 Troubleshooting

### Cloudinary Issues:

1. **"Invalid API credentials"** error:
   - Double-check your Cloud Name, API Key, and API Secret
   - Ensure there are no extra spaces in the `.env.local` file

2. **Upload failing with unsigned preset**:
   - Verify that your upload preset exists and is set to "Unsigned" mode
   - Check that the preset name matches exactly

3. **Images not displaying**:
   - Verify that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correctly set
   - Check browser console for any CORS or network errors

### Database Issues:

- If migrations fail, ensure PostgreSQL is running and credentials are correct
- Reset database: `npx prisma migrate reset` (⚠️ This will delete all data)

---

## 📚 Useful Commands
```bash
# Reset and seed database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Happy Coding! 🎉**