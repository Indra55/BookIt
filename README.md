# 🎫 BookIt: Experiences & Slots

<div align="center">

**A modern, full-stack booking platform for discovering and reserving unique travel experiences**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-19-61dafb)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-316192)](https://www.postgresql.org)

[Live Demo](https://bookit.hitanshu.tech/) • [Documentation](https://github.com/Indra55/BookIt/blob/main/README.md) • [Report Bug](https://github.com/indra55/bookit/issues) • [Request Feature](https://github.com/indra55/bookit/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---
## 📸 Screenshots

### Desktop & Mobile Views
<p align="center">
  <img src="./img/6.png" alt="Desktop View" width="48%"/>
  <img src="./img/7.png" alt="Mobile View" width="18%"/>
</p>

### Search, Booking & Experience Details
<p align="center">
  <img src="./img/5.png" alt="Search Functionality" width="30%"/>
  <img src="./img/4.png" alt="Booking View" width="30%"/>
  <img src="./img/3.png" alt="Experience Details" width="30%"/>
</p>

### Checkout & Confirmation
<p align="center">
  <img src="./img/2.png" alt="Checkout Page" width="45%"/>
  <img src="./img/1.png" alt="Confirmation Page" width="45%"/>
</p>
---

## 🎯 Overview

BookIt is a comprehensive booking platform designed to connect users with unique travel experiences. Built with modern web technologies, it offers real-time slot management, secure payments, and an intuitive user interface that works seamlessly across all devices.

### Why BookIt?

- 🚀 **High Performance**: Optimized for speed with server-side rendering and efficient caching
- 🔒 **Secure**: JWT-based authentication and secure payment processing
- 📱 **Responsive**: Mobile-first design that works on any device
- ⚡ **Real-time**: Live slot availability updates
- 🎨 **Modern UI**: Clean, intuitive interface built with TailwindCSS

---

## ✨ Key Features

### For Users
- 🔍 **Smart Discovery**: Browse curated experiences with advanced filtering
- 📅 **Real-time Availability**: See available time slots instantly
- 💰 **Promo Codes**: Apply discount codes at checkout
- 📧 **Email Confirmations**: Receive instant booking confirmations
- 🔐 **Secure Authentication**: Safe and encrypted user accounts
- 📱 **Mobile Optimized**: Book on-the-go with our responsive design
- 🔄 **Pagination**: Easily navigate through experiences with intuitive page controls

### For Developers
- 🏗️ **Clean Architecture**: Well-organized, maintainable codebase
- 🧪 **Tested**: Comprehensive test coverage with Jest
- 📚 **Documented**: Clear API documentation and inline comments
- 🔄 **RESTful API**: Standard REST endpoints for easy integration
- 🐳 **Docker Ready**: Containerized deployment setup included

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Icons**: Lucide React

</td>
<td width="50%" valign="top">

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL with pg
- **Authentication**: JWT
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Environment**: dotenv

</td>
</tr>
</table>

---

## 📁 Project Structure

```
highway_delite/
│
├── 📱 client/                    # Frontend React application
│   ├── public/                   # Static assets
│   │   └── images/               # Image assets
│   │
│   └── src/
│       ├── assets/               # Fonts, icons, etc.
│       ├── components/           # Reusable UI components
│       │   ├── common/           # Shared components
│       │   ├── layout/           # Layout components
│       │   └── forms/            # Form components
│       │
│       ├── pages/                # Page components
│       │   ├── Home.tsx
│       │   ├── ExperienceDetail.tsx
│       │   ├── Booking.tsx
│       │   └── Confirmation.tsx
│       │
│       ├── services/             # API service layer
│       │   ├── api.ts            # Axios configuration
│       │   ├── experienceService.ts
│       │   └── bookingService.ts
│       │
│       ├── utils/                # Utility functions
│       ├── types/                # TypeScript types
│       └── App.tsx               # Root component
│
└── 🔧 server/                    # Backend Express server
    ├── config/                   # Configuration files
    │   └── database.js           # Database connection
    │
    ├── middleware/               # Express middleware
    │   ├── auth.js               # Authentication
    │   ├── validation.js         # Request validation
    │   └── errorHandler.js       # Error handling
    │
    ├── routes/                   # API routes
    │   ├── experiences.js
    │   ├── bookings.js
    │   ├── auth.js
    │   └── email.js
    │
    ├── services/                 # Business logic
    │   ├── experienceService.js
    │   ├── bookingService.js
    │   ├── promoService.js
    │   └── emailService.js
    │
    ├── tests/                    # Test files
    │   ├── unit/
    │   └── integration/
    │
    ├── utils/                    # Helper functions
    └── server.js                 # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js `>= 18.0.0`
- npm `>= 9.0.0`
- PostgreSQL `>= 14.0`
- Git

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/indra55/bookit.git
cd highway_delite
```

#### 2️⃣ Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_PSQL=postgresql://username:password@localhost:5432/bookit

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### 3️⃣ Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 4️⃣ Database Setup

```bash
# Create database
createdb bookit

# Run migrations (if available)
npm run migrate

# Seed sample data (optional)
npm run seed
```

#### 5️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

🎉 **Application is now running!**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Experiences

#### Get All Experiences (Paginated)
```http
GET /api/experiences?page=1&limit=6
```

**Response:**
```json
{
  "experiences": [
    {
      "id": 1,
      "title": "Sunset Yacht Cruise",
      "description": "Experience breathtaking sunset views on our luxury yacht",
      "price": 89.99,
      "duration": 120,
      "image_url": "/images/sunset-cruise.jpg",
      "location": "Coastal Bay",
      "rating": 4.8,
      "total_slots": 20,
      "available_slots": 15
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 7
}
```

#### Get Experience Details
```http
GET /api/experiences/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Sunset Yacht Cruise",
  "description": "Enjoy a beautiful sunset on the water with our luxury yacht...",
  "price": 89.99,
  "duration": 120,
  "image_url": "/images/sunset-cruise.jpg",
  "location": "Coastal Bay",
  "rating": 4.8,
  "total_slots": 20,
  "available_slots": 15,
  "included": [
    "Welcome drink",
    "Gourmet snacks",
    "Live music",
    "Professional photography"
  ],
  "requirements": [
    "Minimum age: 12 years",
    "Swimwear recommended",
    "Valid ID required"
  ],
  "cancellation_policy": "Free cancellation up to 24 hours before the experience"
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "experience_id": 1,
  "date": "2025-12-15",
  "time_slot": "18:00",
  "participants": 2,
  "promo_code": "SUMMER10",
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "special_requests": "Window seat preferred"
}
```

**Response:**
```json
{
  "id": 1,
  "booking_number": "BK-2025-1234",
  "experience_id": 1,
  "user_id": 1,
  "date": "2025-12-15",
  "time_slot": "18:00",
  "participants": 2,
  "base_price": 179.98,
  "discount": 18.00,
  "total_price": 161.98,
  "status": "confirmed",
  "created_at": "2025-10-31T08:00:00Z"
}
```

#### Get User Bookings
```http
GET /api/bookings/user
Authorization: Bearer <token>
```

### Promo Codes

#### Validate Promo Code
```http
POST /api/bookings/promo/validate
Content-Type: application/json

{
  "promo_code": "SUMMER10",
  "subtotal": 200.00
}
```

**Response:**
```json
{
  "valid": true,
  "code": "SUMMER10",
  "discount_type": "percentage",
  "discount_value": 10,
  "discount_amount": 20.00,
  "new_total": 180.00,
  "message": "Promo code applied successfully"
}
```

For complete API documentation, visit our [API Docs](https://docs.bookit.com).

---

## 🧪 Testing

### Run Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Run Frontend Tests

```bash
cd client

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage Goals

- Unit Tests: > 80%
- Integration Tests: > 70%
- E2E Tests: Critical user flows

---

## 🚀 Deployment

### Option 1: Traditional Deployment

#### Build Frontend
```bash
cd client
npm run build
# Output in client/dist/
```

#### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

### Option 2: Docker Deployment

```bash
# Build and run containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down
```

**Docker Compose Configuration:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: bookit
      POSTGRES_USER: bookit_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DB_PSQL: postgresql://bookit_user:secure_password@postgres:5432/bookit
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Option 3: Cloud Deployment

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or AWS Elastic Beanstalk
- **Database**: Supabase, Neon, or AWS RDS

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Hitanshu Gala**
- Twitter: [@dev_hitanshu](https://twitter.com/dev_hitanshu)
- Email: galahitanshu@gmail.com
- GitHub: [@indra55](https://github.com/indra55)

---

## 🙏 Acknowledgments

- Design inspiration from [Figma Design](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=UvYrVS9rMFjNGkEr-0)
- Built with [Vite](https://vitejs.dev/)
- Powered by [React](https://reactjs.org/)
- Backend with [Express](https://expressjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)

---

## 📞 Support

Need help? Here's how to get support:

- 📧 Email: galahitanshu@gmail.com
- 🐛 [Report Issues](https://github.com/indra55/bookit/issues)
- 💬 [Discussions](https://github.com/indra55/bookit/discussions)

---

<div align="center">

**[⬆ Back to Top](#-bookit-experiences--slots)**

Made with ❤️ by [Hitanshu Gala](https://github.com/indra55)

⭐ Star this repo if you find it helpful!

</div>