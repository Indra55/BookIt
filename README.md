# 🚀 BookIt: Experiences & Slots - Fullstack Booking Platform

A modern, full-stack web application for discovering and booking unique travel experiences with real-time slot availability. Built with a focus on performance, scalability, and user experience.

## 🌟 Key Features

- **Dynamic Experience Discovery**: Browse curated travel experiences with rich media
- **Real-time Slot Management**: View and book available time slots
- **Promo Code System**: Apply and validate promotional codes
- **Responsive Design**: Seamless experience across all devices
- **Secure Authentication**: JWT-based user authentication
- **Email Notifications**: Booking confirmations and 
- **Pagination**: Efficiently browse through experiences with server-side pagination

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide Icons
- **Form Handling**: React Hook Form with Yup validation

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with pg
- **Authentication**: JWT
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Environment Management**: dotenv

## 🏗 Project Structure

```
highway_delite/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   └── src/                 # Source code
│       ├── assets/          # Images, fonts, etc.
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── utils/           # Utility functions
│
└── server/                  # Backend Express server
    ├── config/             # Configuration files
    ├── middleware/         # Express middleware
    ├── routes/             # API routes
    ├── services/           # Business logic
    ├── tests/              # Test files
    └── utils/              # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bookit.git
   cd highway_delite
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

4. **Environment Variables**
   Create a `.env` file in both `client` and `server` directories with the following variables:

   **Server (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   DB_PSQL=postgresql://username:password@localhost:5432/bookit
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

   **Client (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Database Setup**
   ```bash
   # Create a new PostgreSQL database
   createdb bookit
   ```

6. **Start the development servers**
   ```bash
   # In server directory
   npm run dev

   # In a new terminal, from client directory
   cd client
   npm run dev
   ```

## 🧠 Features Implemented

### Frontend
- **Responsive UI**
  - Mobile-first design using TailwindCSS
  - Responsive grid layout for experience cards
  - Adaptive forms for different screen sizes

- **User Experience**
  - Smooth page transitions with React Router
  - Form validation with Yup
  - Loading states and error handling
  - Toast notifications for user feedback

- **State Management**
  - Context API for global state
  - Custom hooks for data fetching
  - Optimistic UI updates

### Backend
- **RESTful API**
  - JWT authentication
  - Rate limiting
  - Request validation

- **Database**
  - PostgreSQL schema design
  - Efficient query optimization
  - Data validation at the model level

- **Email Service**
  - Booking confirmations
  - Password reset functionality
  - Promotional emails

## 📚 API Documentation

### Experiences

#### `GET /api/experiences`
Get paginated list of experiences

**Query Parameters**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 6)

**Response**
```json
{
  "experiences": [
    {
      "id": 1,
      "title": "Sunset Cruise",
      "description": "Enjoy a beautiful sunset on the water",
      "price": 89.99,
      "duration": 120,
      "image_url": "/images/sunset-cruise.jpg",
      "location": "Coastal Bay",
      "rating": 4.8,
      "total_slots": 20,
      "available_slots": 15
    }
  ],
  "total": 15,
  "page": 1,
  "totalPages": 3
}
```

#### `GET /api/experiences/:id`
Get experience details by ID

**Response**
```json
{
  "id": 1,
  "title": "Sunset Cruise",
  "description": "Enjoy a beautiful sunset on the water with our luxury yacht.",
  "price": 89.99,
  "duration": 120,
  "image_url": "/images/sunset-cruise.jpg",
  "location": "Coastal Bay",
  "rating": 4.8,
  "total_slots": 20,
  "available_slots": 15,
  "included": ["Welcome drink", "Snacks", "Live music"],
  "requirements": ["Minimum age: 12", "Swimwear recommended"],
  "cancellation_policy": "Free cancellation up to 24 hours before"
}
```

### Bookings

#### `POST /api/bookings`
Create a new booking

**Request**
```json
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
  "special_requests": "Window seat if possible"
}
```

**Response**
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

### Promo Codes

#### `POST /api/bookings/promo/validate`
Validate a promo code

**Request**
```json
{
  "promo_code": "SUMMER10",
  "subtotal": 200.00
}
```

**Response**
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

### Email Notifications

#### `POST /api/email/send-booking-confirmation`
Send booking confirmation email

**Request**
```json
{
  "to": "customer@example.com",
  "booking_details": {
    "booking_number": "BK-2025-1234",
    "experience_title": "Sunset Cruise",
    "date": "2025-12-15",
    "time_slot": "18:00",
    "participants": 2,
    "total_price": 161.98
  }
}
```

**Response**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

3. **Start the production server**
   ```bash
   cd ../server
   npm start
   ```

### Docker Deployment

```bash
docker-compose up --build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/dev_hitanshu) - your.galahitanshu@gmail.com

Project Link: [https://github.com/indra55/bookit](https://github.com/indra55/bookit)

## 🎉 Acknowledgments

- [Figma Design](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=UvYrVS9rMFjNGkEr-0)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)