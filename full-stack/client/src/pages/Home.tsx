import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  StarIcon, 
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Store Ratings</h1>
          <p className="text-lg text-gray-600 mb-8">Rate and discover stores in your area</p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'System Administrator';
      case 'user':
        return 'Normal User';
      case 'store_owner':
        return 'Store Owner';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600">
            You are logged in as a {getRoleDisplayName(user.role)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {user.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Dashboard</h3>
                    <p className="text-gray-600">View system statistics and overview</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                    <p className="text-gray-600">Add, edit, and manage user accounts</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/stores"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Manage Stores</h3>
                    <p className="text-gray-600">Add and manage store listings</p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {user.role === 'user' && (
            <>
              <Link
                to="/stores"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Browse Stores</h3>
                    <p className="text-gray-600">Search and discover stores to rate</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/profile"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">My Profile</h3>
                    <p className="text-gray-600">Update your account information</p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {user.role === 'store_owner' && (
            <>
              <Link
                to="/store-owner/dashboard"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">My Store Dashboard</h3>
                    <p className="text-gray-600">View store ratings and statistics</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/profile"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">My Profile</h3>
                    <p className="text-gray-600">Update your account information</p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <span className="text-gray-700">Rate stores and share your experience</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-500 mr-3" />
              <span className="text-gray-700">Discover new stores in your area</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-gray-700">View detailed ratings and reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 