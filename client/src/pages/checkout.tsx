// @ts-ignore
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface PromoDetails {
  code: string;
  discount_percent: number;
  discount_amount: number;
}

interface BookingDetails {
  experienceId: string;
  slotId: string;
  title: string;
  date: string;
  time: string;
  quantity: number;
  basePrice: number;
  subtotal?: number;
  taxes?: number;
  total?: number;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: experienceIdFromUrl } = useParams<{ id: string }>();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoDetails | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    experienceId: '',
    slotId: '',
    title: 'Kayaking',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 am',
    quantity: 1,
    basePrice: 999
  });

  useEffect(() => {
    if (location.state) {
      console.log('Location state:', location.state);
      setBookingDetails(prev => ({
        ...prev,
        ...location.state,
        experienceId: experienceIdFromUrl || location.state.experienceId || ''
      }));
      
      if (!location.state.slotId) {
        console.error('No slotId found in location state');
        alert('Invalid booking details. Please go back and select a time slot again.');
        navigate(-1);
      }
    } else if (experienceIdFromUrl) {
      console.error('No location state found, only experienceId in URL');
      alert('Invalid booking details. Please go back and select a time slot again.');
      navigate(-1); 
    } else {
      console.error('No booking details found');
      alert('No booking details found. Please start over.');
      navigate('/'); 
    }
  }, [location.state, experienceIdFromUrl]);

  const subtotal = parseFloat((bookingDetails.basePrice * bookingDetails.quantity).toFixed(2));
  const discount = appliedPromo ? parseFloat(((subtotal * appliedPromo.discount_percent) / 100).toFixed(2)) : 0;
  const discountedSubtotal = parseFloat((subtotal - discount).toFixed(2));
  const taxes = parseFloat((discountedSubtotal * 0.059).toFixed(2));
  const total = parseFloat((discountedSubtotal + taxes).toFixed(2));

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const response = await fetch('https://bookit-o6sm.onrender.com/api/booking/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promo_code: promoCode,
          subtotal: subtotal
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate promo code');
      }

      if (!data.valid) {
        throw new Error(data.message || 'Invalid promo code');
      }

      setAppliedPromo({
        code: data.promo.code,
        discount_percent: data.promo.discount_percent,
        discount_amount: data.promo.discount_amount
      });
      setPromoError('');
    } catch (error) {
      setAppliedPromo(null);
      setPromoError(error instanceof Error ? error.message : 'Failed to apply promo code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handlePayAndConfirm = async () => {
    if (!agreedToTerms) {
      alert("Please agree to the terms and safety policy.");
      return;
    }

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!email || emailError) {
      alert("Please enter a valid email address");
      return;
    }

    if (!bookingDetails.slotId) {
      alert("No time slot selected. Please go back and select a time.");
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      const requestBody = {
        experience_id: bookingDetails.experienceId,
        slot_id: bookingDetails.slotId,
        user_name: fullName.trim(),
        user_email: email.trim(),
        quantity: bookingDetails.quantity,
        promo_code: appliedPromo?.code || null,
        subtotal: subtotal,
        tax_amount: taxes,
        discount_amount: appliedPromo?.discount_amount || 0,
        total_amount: total,
      };

      console.log('Sending booking request:', requestBody);

      const response = await fetch('https://bookit-o6sm.onrender.com/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Booking response:', data);

      if (!response.ok) {
        const errorMessage = data.errors ? data.errors.join(', ') : data.message || 'Failed to process booking';
        throw new Error(errorMessage);
      }

      navigate('/booking-confirmation', {
        state: {
          bookingId: data.booking?.id || data.bookingId, 
          bookingDetails: {
            ...bookingDetails,
            fullName: fullName.trim(),
            email: email.trim(),
            subtotal: data.booking?.subtotal || subtotal,
            taxes: data.booking?.taxes || taxes,
            discount: data.booking?.discount || (appliedPromo?.discount_amount || 0),
            total: data.booking?.total || total,
            promoCode: data.booking?.promo_code || appliedPromo?.code,
            bookingDate: data.booking?.created_at || new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: unknown) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process your booking. Please try again.';
      setPaymentError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Booking
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-3/5">
          <div className="bg-[#efefef] rounded-2xl p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#5B5B5B] mb-1">Full name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ffd643] focus:border-[#ffd643] sm:text-sm bg-[#DDDDDD]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      
                      setEmailError('');
                      
                      if (!value) {
                        setEmailError('Email is required');
                        return;
                      }
                      
                      if (!value.includes('@')) {
                        setEmailError('Email must contain @ symbol');
                        return;
                      }
                      
                      const atIndex = value.indexOf('@');
                      if (atIndex === value.length - 1) {
                        setEmailError('Please enter a domain after @');
                        return;
                      }
                      
                      const domain = value.substring(atIndex + 1);
                      if (!domain.includes('.')) {
                        setEmailError('Please include a valid domain (e.g., example.com)');
                        return;
                      }
                      
                      const lastDotIndex = value.lastIndexOf('.');
                      if (lastDotIndex > atIndex && lastDotIndex === value.length - 1) {
                        setEmailError('Please complete the domain extension (e.g., .com)');
                        return;
                      }
                      
                      if (value.includes(' ')) {
                        setEmailError('Email should not contain spaces');
                        return;
                      }
                    }}
                    placeholder="Your email address"
                    className={`block w-full px-4 py-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-[#ffd643] focus:border-[#ffd643] sm:text-sm bg-[#DDDDDD]`}
                  />
                  {emailError && (
                    <p className="mt-0.5 text-xs text-red-600">{emailError}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <span className="text-green-800 font-medium">{appliedPromo.code}</span>
                      <span className="text-green-600 text-sm ml-2">-{appliedPromo.discount_percent}% off applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 hover:bg-green-100 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ffd643] focus:border-[#ffd643] sm:text-sm bg-[#DDDDDD]"
                        disabled={isValidatingPromo}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isValidatingPromo || !promoCode.trim()}
                      className="whitespace-nowrap inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingPromo ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="focus:ring-[#ffd643] h-4 w-4 text-[#ffd643] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the terms and safety policy
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="bg-[#EFEFEF] rounded-2xl p-6">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Experience</span>
              <span className="font-medium text-gray-900">{bookingDetails.title}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{new Date(bookingDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{bookingDetails.time}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">{bookingDetails.quantity} {bookingDetails.quantity === 1 ? 'Person' : 'People'}</span>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({bookingDetails.quantity} {bookingDetails.quantity === 1 ? 'person' : 'people'})</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium text-gray-900">₹{taxes}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({appliedPromo.discount_percent}% off)</span>
                <span className="font-medium">-₹{appliedPromo.discount_amount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-200 my-6" />

          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">₹{total}</span>
          </div>

          <button
            type="button"
            onClick={handlePayAndConfirm}
            className="w-full py-3 bg-[#ffd643] hover:bg-[#e6c13d] text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!agreedToTerms || isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay and Confirm'
            )}
          </button>
          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {paymentError}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
