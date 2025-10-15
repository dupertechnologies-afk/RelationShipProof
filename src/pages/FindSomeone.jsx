import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { debounce } from '../utils/debounce'; // Import debounce utility

const FindSomeone = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // New state for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // New state to control suggestion visibility
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Loading state for suggestions
  const navigate = useNavigate();

  // Debounce function for fetching suggestions
  const debouncedGetSuggestions = useRef(
    debounce(async (query) => {
      if (query.length > 2) {
        setIsLoadingSuggestions(true);
        try {
          const response = await api.get(`/auth/search?q=${query}`); // Use the correct search endpoint
          setSuggestions(response.data.users);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
      }
    }, 300)
  ).current;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setSearchResults([]);
    setSuggestions([]); // Clear suggestions on explicit search
    setShowSuggestions(false);
    try {
      const response = await api.get(`/auth/search?q=${searchTerm}`); // Use the correct search endpoint
      setSearchResults(response.data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to search users.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTermChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      debouncedGetSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setSearchTerm(user.email); // Set the search term to the clicked suggestion's email
    setSearchResults([user]); // Display the selected user as the search result
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false);
  };

  const handleInviteUser = (user) => {
    navigate('/relationships/invite', { state: { prefilledPartnerEmail: user.email } });
  };

  const handleViewProfile = (user) => {
    // For now, show a toast. In the future, this could navigate to a profile page
    toast.info(`Viewing ${user.fullName}'s profile - Feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Find Someone</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Search for users by username, email, or name to connect with them.</p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by username, email, or name..."
              value={searchTerm}
              onChange={handleSearchTermChange} // Use the new handler
              onFocus={() => {
                if (searchTerm.length > 2 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Hide suggestions on blur after a short delay
              className="pl-12 pr-4 py-3 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-base transition-colors duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Search className="h-5 w-5 text-white" />
            </button>
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {isLoadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => handleSuggestionClick(user)}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-full mr-3 object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">{user.fullName}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No users found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500"></div>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((userResult) => (
                <div key={userResult._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4">
                    {userResult.avatar ? (
                      <img src={userResult.avatar} alt={userResult.username} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">{userResult.firstName?.[0]}{userResult.lastName?.[0]}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userResult.firstName} {userResult.lastName}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">@{userResult.username}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{userResult.email}</p>
                      {userResult.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{userResult.bio}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Member since {new Date(userResult.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleInviteUser(userResult)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2 text-white" />
                      Send Request
                    </button>
                    <button
                      onClick={() => handleViewProfile(userResult)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && searchResults.length === 0 && searchTerm.trim() && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try a different search term or check for typos.
            </p>
          </div>
        )}

        {!isLoading && !searchTerm.trim() && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start searching for users
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a username or email in the search bar above to find people.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindSomeone;

