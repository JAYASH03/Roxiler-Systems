import React, { useState, useEffect } from 'react';
import { Store } from '../types';
import { storesAPI, ratingsAPI } from '../services/api';
import { StarIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getAll();
      const storesData = response.stores || [];
      setStores(storesData);
      
      // Load user ratings for each store
      const ratings: { [key: string]: number } = {};
      for (const store of storesData) {
        try {
          const ratingResponse = await ratingsAPI.getUserRating(store.id);
          if (ratingResponse.rating && ratingResponse.rating.rating) {
            ratings[store.id] = ratingResponse.rating.rating;
          }
        } catch (error) {
          // User hasn't rated this store yet
          console.log(`No rating found for store ${store.id}`);
        }
      }
      setUserRatings(ratings);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await ratingsAPI.submit({ storeId, rating });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      // Reload stores to get updated average ratings
      await loadStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number, interactive = false, storeId?: string) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && storeId ? () => handleRatingSubmit(storeId, star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
          >
            <StarIcon
              className={`h-5 w-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Stores</h1>
        
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">🏪</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No stores are available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                <div className="text-sm text-gray-500">{store.email}</div>
              </div>
              
              <div className="flex items-center mb-3 text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{store.address}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                  <span className="text-sm text-gray-600">
                    {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'} 
                    ({store.totalRatings || 0} ratings)
                  </span>
                </div>
                {store.averageRating && renderStars(Math.round(store.averageRating))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                  {userRatings[store.id] && (
                    <span className="text-sm text-gray-600">
                      {userRatings[store.id]}/5 stars
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {renderStars(userRatings[store.id] || 0, true, store.id)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores; 