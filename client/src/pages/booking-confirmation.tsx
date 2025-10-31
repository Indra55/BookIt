import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingId, bookingDetails, userEmail } = location.state || { 
    bookingId: 'HUF56&SO',
    bookingDetails: {
      date: new Date().toISOString(),
      timeSlot: '10:00 AM - 11:00 AM',
      vehicleType: 'Car',
      location: 'Default Location',
      userName: 'Valued Customer'
    },
    userEmail: ''
  } as const;

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      try {
        if (!userEmail) return;
        
        await api.post('/api/email/send-booking-confirmation', {
          to: userEmail,
          bookingDetails: {
            ...bookingDetails,
            bookingId
          }
        });

        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        toast.error('Failed to send confirmation email');
      }
    };

    sendConfirmationEmail();
  }, [userEmail, bookingId, bookingDetails]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white p-4 overflow-hidden">
      <div className="flex flex-col items-center text-center gap-4 max-w-md w-full">
        <svg 
          className="h-16 w-16"
          viewBox="0 0 52 52" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="26" cy="26" r="26" fill="#22C55E" />
          <path 
            d="M14 27.5L22 35.5L38 19.5" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>

        <h1 className="text-2xl font-semibold text-gray-900">
          Booking Confirmed
        </h1>

        <p className="text-sm text-gray-500">
          Ref ID: {bookingId}
        </p>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
          Confirmation email sent to {userEmail || 'your email'}
        </div>

        <button
          onClick={() => navigate('/experience')}
          className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors w-full sm:w-auto"
        >
          Browse More Experiences
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;