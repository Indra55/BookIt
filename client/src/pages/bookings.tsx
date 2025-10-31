import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

interface Slot {
  id: number;
  date: string; 
  time: string; 
  total_slots: number;
  booked_slots: number;
  status: string;
}

interface ExperienceDetails {
  id: number;
  title: string;
  images: string[];
  description: string;
  location: string;
  base_price: number;
  slots: Slot[];
}


const formatDateShort = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


const formatTimeSimple = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
};

    
const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const experienceId = id || '';

  const [experience, setExperience] = useState<ExperienceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!experienceId) return;  
    
    const fetchExperienceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<ExperienceDetails>(`/api/experiences/${experienceId}`);
        setExperience(data);

        
        if (data.slots && data.slots.length > 0) {
          const sortedSlots = [...data.slots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setSelectedDate(sortedSlots[0].date);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error('Error fetching experience details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [experienceId]);

  if (!experienceId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">No experience ID provided</p>
      </div>
    );
  }

  const uniqueDates = useMemo(() => {
    if (!experience?.slots) return [];
    const dates = experience.slots.map(slot => slot.date);
    const sortedDates = [...new Set(dates)].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return sortedDates;
  }, [experience?.slots]);

  const timesForSelectedDate = useMemo(() => {
    if (!experience?.slots || !selectedDate) return [];
    return experience.slots
      .filter(slot => slot.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time)); 
  }, [experience?.slots, selectedDate]);


  const basePrice = experience?.base_price || 0;
  const subtotal = basePrice * quantity;
  const taxes = Math.round(subtotal * 0.059);
  const total = subtotal + taxes;
  
 

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-red-500">Error loading experience: {error}</p>
      </div>
    );
  }

  if (!experience) {
    return null; 
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Details
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          
          <div className="mb-6">
            <img 
              src={experience.images[0] || 'https://placehold.co/1200x800/cccccc/999999?text=Image'} 
              alt={experience.title} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://placehold.co/1200x800/cccccc/999999?text=Image+Not+Found`;
              }}
            />
          </div>

           <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {experience.description}
          </p>

           <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose date</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueDates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTimeId(null);  
                  }}
                  className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedDate === date
                      ? 'bg-[#ffd643] border-[#ffd643] text-gray-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {formatDateShort(date)}
                </button>
              ))}
            </div>
          </div>

           <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose time</h2>
            <div className="flex flex-wrap gap-3">
              {timesForSelectedDate.map((slot) => {
                const slotsLeft = slot.total_slots - slot.booked_slots;
                const isSoldOut = slotsLeft <= 0 || slot.status !== 'available';
                const hasLowStock = slotsLeft > 0 && slotsLeft <= 5;

                return (
                  <button
                    key={slot.id}
                    onClick={() => !isSoldOut && setSelectedTimeId(slot.id)}
                    disabled={isSoldOut}
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSoldOut
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : selectedTimeId === slot.id
                          ? 'bg-white border-gray-900 text-gray-900 ring-1 ring-gray-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{formatTimeSimple(slot.time)}</span>
                    {isSoldOut ? (
                      <span className="ml-2 text-xs">(Sold out)</span>
                    ) : hasLowStock ? (
                      <span className="ml-2 text-xs text-red-500">({slotsLeft} left)</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">All times are in IST (GMT +5:30)</p>
          </div>

           <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

        </div>

         <div className="w-full lg:w-1/3">
           <div className="bg-[#efefef] rounded-lg border border-gray-200 shadow-sm p-6 sticky top-28">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Starts at</span>
                <span className="font-medium text-gray-900">₹{basePrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-l-md"
                    disabled={quantity === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-gray-900 font-medium">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-r-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-900">₹{taxes}</span>
              </div>
            </div>

             
            <hr className="border-gray-200 my-6" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total}</span>
            </div>

            <button 
              className={`w-full py-3 font-semibold rounded-lg ${
                selectedTimeId 
                  ? 'bg-[#ffd643] text-gray-900 hover:bg-[#e6c13d]' 
                  : 'bg-[#d7d7d7] text-white cursor-not-allowed'
              }`}
              disabled={!selectedTimeId}
              onClick={() => {
                if (selectedTimeId && experience) {
                  const selectedSlot = experience.slots.find(slot => slot.id === selectedTimeId);
                  if (selectedSlot) {
                    navigate(`/checkout/${experienceId}`, { 
                      state: { 
                        experienceId: experience.id,
                        slotId: selectedSlot.id,  
                        title: experience.title,
                        date: selectedDate,
                        time: formatTimeSimple(selectedSlot.time),
                        quantity,
                        basePrice: experience.base_price,
                        subtotal,
                        taxes,
                        total
                      } 
                    });
                  }
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
