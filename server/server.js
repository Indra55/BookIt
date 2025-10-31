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

const allowedOrigins = [
  'http://localhost:5173',   
  'http://localhost:30517300',
  'http://127.0.0.1:5173',
  'https://cw8nsbb5-5173.inc1.devtunnels.ms'  
];

app.use(cors({
  origin: function (origin, callback) {
     if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.warn(`CORS error: ${origin} not allowed`);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
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
