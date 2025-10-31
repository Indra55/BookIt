import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Users, Shield, Star, ChevronRight } from 'lucide-react';
import ExperiencesPage from './pages/experience';
import BookingPage from './pages/bookings';
import CheckoutPage from './pages/checkout';
import BookingConfirmation from './pages/booking-confirmation';
import Header from './components/header';

interface LayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  onSearch,
  isLoading
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {!isLandingPage && (
        <Header 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          isLoading={isLoading}
        />
      )}
      {children}
    </div>
  );
};

 const BookItLanding = () => {
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
       <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <img src="/logo.png" alt="Highway Delite" className="h-14" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-[#fff9e6] text-[#8a6d0f] px-4 py-2 rounded-full mb-6 border border-[#ffd643]">
            <Star className="w-4 h-4 fill-[#ffd643]" />
            <span className="text-sm font-medium">Trusted by 10,000+ adventure seekers</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Book Your Next
            <span className="block text-gray-700">
              Adventure
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover curated travel experiences with certified guides. From kayaking adventures to scenic treks - your next unforgettable journey starts here.
          </p>

           <div className="flex gap-4 justify-center items-center">
            <Link 
              to="/experience"
              className="group relative w-full sm:w-auto px-8 py-4 bg-[#ffd643] hover:bg-[#e6c13d] text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center"
            >
              <span className="flex items-center justify-center">
                 Explore All Experiences
                 <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

       <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Highway Delite?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Experiences</h3>
              <p className="text-gray-600">Handpicked adventures across India's most beautiful destinations</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Select your date, choose a slot, and book in minutes</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">Certified guides and gear included with every experience</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small Groups</h3>
              <p className="text-gray-600">Intimate group sizes for a personalized experience</p>
            </div>
          </div>
        </div>
      </div>

       <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="text-center p-8 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#ffd643] text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse Experiences</h3>
              <p className="text-gray-600">Explore curated adventures across various destinations</p>
            </div>

            <div className="text-center p-8 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#ffd643] text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Select & Book</h3>
              <p className="text-gray-600">Choose your preferred date and time slot</p>
            </div>

            <div className="text-center p-8 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#ffd643] text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enjoy!</h3>
              <p className="text-gray-600">Show up and have an unforgettable experience</p>
            </div>
          </div>
        </div>
      </div>

       <div className="py-20 bg-[#ffd643]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-800 mb-10">
            Join thousands of happy travelers and book your experience today
          </p>
           <Link to="/experience">
            <button className="px-10 py-4 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>

       <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                 <Link to="/">
                  <img src="/logo.png" alt="Highway Delite" className="h-8" />
                </Link>
              </div>
              <p className="text-sm">Your gateway to extraordinary travel experiences</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#ffd643] transition">About Us</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Careers</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#ffd643] transition">Help Center</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Safety</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Cancellation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#ffd643] transition">Terms</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Privacy</a></li>
                <li><a href="#" className="hover:text-[#ffd643] transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Highway Delite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

 const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

   const handleSearch = (query: string) => {
    setIsSearching(true);
    const trimmedQuery = query.trim();
    
     const searchParams = new URLSearchParams(location.search);
    if (trimmedQuery) {
      searchParams.set('search', trimmedQuery);
    } else {
      searchParams.delete('search');
    }
    
     if (location.pathname !== '/experience') {
      navigate(`/experience?${searchParams.toString()}`);
    } else {
       window.history.pushState({}, '', `?${searchParams.toString()}`);
       setSearchQuery(trimmedQuery);
    }
    
     setTimeout(() => setIsSearching(false), 300);
  };

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const newSearchQuery = searchParam !== null ? decodeURIComponent(searchParam) : '';
    
    if (newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery);
    }
  }, [location.search]);

  return (
    <Routes>
      <Route path="/" element={<BookItLanding />} />
      <Route path="/bookings/:id" element={
        <Layout 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isSearching}
        >
          <BookingPage />
        </Layout>
      } />
      <Route 
        path="/experience" 
        element={
          <Layout 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            isLoading={isSearching}
          >
            <ExperiencesPage 
              searchQuery={searchQuery} 
              onLoadingStateChange={setIsSearching} 
            />
          </Layout>
        } 
      />
      <Route 
        path="/checkout/:id" 
        element={
          <Layout 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            isLoading={isSearching}
          >
            <CheckoutPage />
          </Layout>
        } 
      />
      <Route 
        path="/booking-confirmation" 
        element={
          <Layout 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            isLoading={isSearching}
          >
            <BookingConfirmation />
          </Layout>
        } 
      />
    </Routes>
  );
};

export default App;