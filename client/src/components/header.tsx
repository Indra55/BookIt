import React, { useState, useEffect } from 'react';
import { Loader2, Search, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  isLoading = false,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(localQuery);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 space-x-4">
          {/* Logo (Hidden when mobile search is open) */}
          <div
            className={`flex items-center space-x-2 ${
              isSearchOpen ? 'hidden sm:flex' : 'flex'
            } flex-shrink-0`}
          >
            <img
              src="/logo.png"
              alt="Highway Delite Logo"
              className="h-12 w-auto"
              onError={(e) =>
                (e.currentTarget.src =
                  'https://placehold.co/100x50/fef08a/333?text=Logo')
              }
            />
          </div>

          {/* Desktop Search Bar (Hidden on mobile) */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Input field wrapper */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search experiences..."
                value={localQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalQuery(value);
                  setIsTyping(!!value);
                }}
                onKeyPress={handleKeyPress}
                className="w-64 sm:w-80 md:w-96 px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-[#ffd643] transition-all duration-200 placeholder-gray-500"
              />
              {(isLoading || (isTyping && localQuery !== searchQuery)) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {/* Search Button */}
            <button
              onClick={() => onSearch(localQuery)}
              disabled={isLoading}
              className={`px-6 py-3 bg-[#ffd643] hover:bg-[#e6c13d] text-gray-900 font-medium rounded-lg transition-all duration-200 ${
                isLoading
                  ? 'opacity-75 cursor-not-allowed'
                  : 'hover:shadow-md'
              }`}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* --- MODIFIED: Mobile Search Icon --- */}
          <div
            className={`flex sm:hidden ${isSearchOpen ? 'hidden' : 'flex'}`}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              // 1. Added yellow background and hover state
              // 2. Changed to rounded-lg to match other buttons
              className="p-2 rounded-lg bg-[#ffd643] hover:bg-[#e6c13d] transition-all duration-200"
            >
              {/* 3. Changed icon color to dark for contrast */}
              <Search className="h-6 w-6 text-gray-900" />
            </button>
          </div>

          {/* Mobile Search Bar (Shows when search is open) */}
          <div
            className={`flex sm:hidden items-center space-x-2 w-full ${
              isSearchOpen ? 'flex' : 'hidden'
            }`}
          >
            {/* Input field wrapper (full width) */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search experiences..."
                value={localQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalQuery(value);
                  setIsTyping(!!value);
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-[#ffd643] transition-all duration-200 placeholder-gray-500"
                autoFocus // Automatically focus the input when it appears
              />
              {(isLoading || (isTyping && localQuery !== searchQuery)) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;