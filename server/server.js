import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendBookingConfirmation } from './services/emailService.js';
import authRouter from './routes/auth-route.js';
import userRouter from './routes/user-route.js';
import experienceRouter from './routes/experience-route.js';
import bookingRouter from './routes/booking-route.js';
import emailRouter from './routes/email-route.js';
import errorHandler from './middleware/errorHandler.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Development environment - allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Production environment - only allow specific origins
    const allowedOrigins = [
      'https://bookit-frontend-bx9p.onrender.com',
      'https://bookit.hitanshu.tech',
      'https://bookit-o6sm.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Also allow subdomains of hitanshu.tech
    if (origin.endsWith('.hitanshu.tech')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.warn(`CORS error: ${origin} not allowed`);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/',(req,res)=>{
    console.log("hello world") 
    res.send("Server is running!!!")
}) 
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/email', emailRouter);  
 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  

export default app;
