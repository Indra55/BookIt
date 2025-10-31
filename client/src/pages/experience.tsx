import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../utils/api';

const ImageWithLoader = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  useEffect(() => {
    if (imgRef.current?.complete) {
      handleLoad();
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Image not available</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={isError ? `https://placehold.co/600x400/cccccc/999999?text=Image+Not+Found` : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading || isError ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

interface Experience {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
}

interface ApiResponse {
  data: Experience[];
  page: number;
  limit: number;
  total: number;
}

interface ApiExperienceData {
  id: number | string;
  title: string;
  images: string | string[]; 
  description: string;
  location: string;
  base_price: number;
}

interface ExperiencesPageProps {
  searchQuery?: string;
  onLoadingStateChange?: (isLoading: boolean) => void;
}

const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ searchQuery = '', onLoadingStateChange }) => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences(currentPage, searchQuery);
  }, [currentPage, searchQuery]);


  const fetchExperiences = async (page: number, search: string = '') => {
    setLoading(true);
    onLoadingStateChange?.(true);
    
    try {
      const params = {
        page: page.toString(),
        limit: '8',
        ...(search && { search })
      };
      
      const apiResponse = await api.get<{
        page: number;
        limit: number;
        total: number;
        data: ApiExperienceData[];
      }>('/api/experiences', params);
      
      console.log('API Response:', apiResponse);
      
      console.log('API Response:', apiResponse);

      const mappedData: Experience[] = apiResponse.data.map((item: ApiExperienceData) => {
        let images: string[] = [];
        if (typeof item.images === 'string') {
          try {
            images = JSON.parse(item.images);
            if (typeof images === 'string') images = [images];
          } catch (e) {
            images = [item.images];
          }
        } else if (Array.isArray(item.images)) {
          images = item.images;
        }
        
        const imageUrl = images.length > 0 ? images[0] : 'https://placehold.co/600x400/cccccc/999999?text=Image+Missing';
        
        return {
          id: item.id.toString(),
          name: item.title,
          location: item.location,
          description: item.description,
          price: item.base_price,
          image: imageUrl,
        };
      });

      const data: ApiResponse = {
        data: mappedData,
        page: apiResponse.page,
        limit: apiResponse.limit,
        total: apiResponse.total,
      };
            
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from API: missing or invalid data array');
      }
      
      const calculatedTotalPages = Math.ceil(data.total / data.limit);
      
      setExperiences(data.data);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      onLoadingStateChange?.(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6 animate-pulse"></div>
            <div className="flex justify-between items-center">
              <div>
                <div className="h-3 bg-gray-200 rounded w-10 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="transition-opacity duration-300">
          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery 
                  ? `No experiences found matching "${searchQuery}"`
                  : 'No experiences available at the moment.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => window.location.href = '/experience'}
                  className="mt-4 px-4 py-2 bg-[#ffd643] hover:bg-[#e6c13d] text-gray-900 font-medium rounded-md transition-all duration-300 ease-in-out hover:scale-105"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#f0f0f0] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer group"
                  onClick={() => navigate(`/bookings/${exp.id}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithLoader 
                      src={exp.image}
                      alt={exp.name}
                      className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{exp.name}</h3>
                      <span className="text-xs bg-[#d6d6d6] text-gray-700 px-3 py-1 rounded-full whitespace-nowrap">
                        {exp.location}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                      {exp.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-xl font-bold text-gray-900">₹{exp.price}</p>
                      </div>
                      <button className="px-4 py-2 bg-[#ffd643] hover:bg-[#e6c13d] text-gray-900 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {experiences.length > 0 && (
            <>
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 ${
                          currentPage === pageNum
                            ? 'bg-[#ffd643] text-gray-900 scale-105'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                Page {currentPage} of {totalPages}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperiencesPage;