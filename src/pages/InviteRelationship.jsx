import { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, Users, X } from 'lucide-react';
import { toast } from 'react-toastify';
import useRelationshipStore from '../store/relationshipStore';
import useAuthStore from '../store/authStore';
import { debounce } from '../utils/debounce';

const InviteRelationship = () => {
  const navigate = useNavigate();
  const { createRelationship, isLoading } = useRelationshipStore();
  const { searchUserByRegistrationId, isLoading: isSearchingUser, searchUsersByEmail } = useAuthStore();
  const location = useLocation(); // Get location object

  const [formData, setFormData] = useState(() => {
    const prefilledEmail = location.state?.prefilledPartnerEmail;
    return {
      partnerIdentifier: prefilledEmail || '', // Can be email or registrationId
      identifierType: prefilledEmail ? 'email' : 'email', // Default to email if prefilled, otherwise default to email
      title: '',
      type: 'friend',
      description: ''
    };
  });
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce function for email search
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length > 2) {
        const result = await searchUsersByEmail(query);
        if (result.success) {
          setEmailSuggestions(result.users);
          setShowSuggestions(true);
        } else {
          setEmailSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setEmailSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)
  ).current;

  const relationshipTypes = [
    { value: 'acquaintance', label: 'Acquaintance', description: 'Someone you know casually' },
    { value: 'friend', label: 'Friend', description: 'A good friend you enjoy spending time with' },
    { value: 'close_friend', label: 'Close Friend', description: 'A close friend you trust and confide in' },
    { value: 'best_friend', label: 'Best Friend', description: 'Your closest friend and confidant' },
    { value: 'romantic_interest', label: 'Romantic Interest', description: 'Someone you\'re romantically interested in' },
    { value: 'partner', label: 'Partner', description: 'Your romantic partner' },
    { value: 'engaged', label: 'Engaged', description: 'Your fiancé/fiancée' },
    { value: 'married', label: 'Married', description: 'Your spouse' },
    { value: 'family', label: 'Family', description: 'A family member' },
    { value: 'mentor', label: 'Mentor', description: 'Someone who guides and teaches you' },
    { value: 'mentee', label: 'Mentee', description: 'Someone you guide and teach' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'partnerIdentifier' && formData.identifierType === 'email') {
      if (value.length > 2) {
        debouncedSearch(value);
        // Check for exact match to auto-fill
        const exactMatch = emailSuggestions.find(user => user.email === value);
        if (exactMatch) {
          handleSuggestionClick(exactMatch);
          // Also explicitly hide suggestions if not already handled by handleSuggestionClick
          setShowSuggestions(false);
        }
      } else {
        setEmailSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (name === 'identifierType') {
      setEmailSuggestions([]);
      setShowSuggestions(false);
      setSearchedUser(null);
      setSearchError(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchedUser(null);
    setSearchError(null);
    setIsSearching(true);

    if (!formData.partnerIdentifier) {
      setSearchError('Please enter a Registration ID');
      setIsSearching(false);
      return;
    }

    const result = await searchUserByRegistrationId(formData.partnerIdentifier);
    if (result.success) {
      if (result.user._id === useAuthStore.getState().user?.id) {
        setSearchError('You cannot create a relationship with yourself.');
        setSearchedUser(null);
      } else {
        setSearchedUser(result.user);
      }
    } else {
      setSearchError(result.error || 'User not found.');
    }
    setIsSearching(false);
  };

  const handleSuggestionClick = (user) => {
    setFormData(prev => ({
      ...prev,
      partnerIdentifier: user.email,
      showSuggestions: false,
      emailSuggestions: []
    }));
    setSearchedUser(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please fill in the relationship title');
      return;
    }

    let partnerId = null;
    if (formData.identifierType === 'email') {
      if (!formData.partnerIdentifier) {
        toast.error('Please enter a partner\'s email address');
        return;
      }
      // Backend expects partnerEmail for email type, so send it as is
      // No direct change needed here, createRelationship will handle it
    } else if (formData.identifierType === 'registrationId') {
      if (!searchedUser || searchedUser.registrationId !== formData.partnerIdentifier) {
        toast.error('Please search and confirm the user by Registration ID first.');
        return;
      }
      partnerId = searchedUser.id;
    }

    const dataToSend = {
      title: formData.title,
      type: formData.type,
      description: formData.description
    };

    if (formData.identifierType === 'email') {
      dataToSend.partnerEmail = formData.partnerIdentifier;
    } else {
      dataToSend.partnerId = partnerId;
    }
    
    const result = await createRelationship(dataToSend);
    
    if (result.success) {
      toast.success('Relationship invitation sent successfully!');
      navigate('/relationships');
    } else {
      toast.error(result.error || 'Failed to send invitation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/relationships"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to relationships
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-full">
                <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Invite Someone Special
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start building a meaningful connection by sending a relationship invitation
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Identifier Type Selector */}
            <div className="mb-4">
              <label htmlFor="identifierType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How do you want to invite them?
              </label>
              <select
                id="identifierType"
                name="identifierType"
                value={formData.identifierType}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    identifierType: e.target.value,
                    partnerIdentifier: ''
                  }));
                  setSearchedUser(null);
                  setSearchError(null);
                }}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="email">By Email Address</option>
                <option value="registrationId">By Registration ID</option>
              </select>
            </div>

            {/* Partner Identifier Input */}
            <div>
              <label htmlFor="partnerIdentifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.identifierType === 'email' ? "Partner's Email Address *" : "Partner's Registration ID *"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.identifierType === 'email' ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Users className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type={formData.identifierType === 'email' ? 'email' : 'text'}
                  id="partnerIdentifier"
                  name="partnerIdentifier"
                  required
                  value={formData.partnerIdentifier}
                  onChange={handleChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onFocus={() => { // Re-show suggestions if there's content and not already selected
                    if (formData.identifierType === 'email' && formData.partnerIdentifier.length > 2 && emailSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={formData.identifierType === 'email' ? "Enter their email address" : "Enter their Registration ID"}
                />
                {showSuggestions && formData.identifierType === 'email' && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                    {emailSuggestions.length > 0 ? (
                      emailSuggestions.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSuggestionClick(user)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="h-6 w-6 rounded-full mr-2" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-secondary-500 flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-medium">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <span>{user.email}</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">({user.fullName})</span>
                        </button>
                      ))
                    ) : (
                      formData.partnerIdentifier.length > 2 && (
                        <div key="no-suggestions" className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          No suggestions found.
                        </div>
                      )
                    )}
                  </div>
                )}
                {formData.identifierType === 'registrationId' && (
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching || !formData.partnerIdentifier}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                )}
              </div>
              {searchError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{searchError}</p>
              )}
              {!searchedUser && formData.identifierType === 'email' && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We'll send them an invitation to connect with you
                </p>
              )}
            </div>

            {/* Searched User Info */}
            {searchedUser && formData.identifierType === 'registrationId' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center space-x-4">
                {searchedUser.avatar ? (
                  <img src={searchedUser.avatar} alt={searchedUser.fullName} className="h-12 w-12 rounded-full" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-secondary-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {searchedUser.firstName?.[0]}{searchedUser.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{searchedUser.fullName} (@{searchedUser.username})</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reg. ID: {searchedUser.registrationId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchedUser(null)}
                  className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Relationship Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Best Friends Forever, Study Partners, etc."
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Give your relationship a meaningful name
              </p>
            </div>

            {/* Relationship Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {relationshipTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {relationshipTypes.find(t => t.value === formData.type)?.description}
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add a personal message or describe what this relationship means to you..."
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This will be included in the invitation
              </p>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Invitation Preview
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  <strong>Subject:</strong> You've been invited to start a "{formData.title || 'relationship'}" relationship
                </p>
                <p className="mb-2">
                  <strong>Type:</strong> {relationshipTypes.find(t => t.value === formData.type)?.label}
                </p>
                {formData.description && (
                  <p>
                    <strong>Message:</strong> {formData.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending invitation...
                  </div>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Send Invitation
                  </>
                )}
              </button>
              
              <Link
                to="/relationships"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-3">
            💡 Tips for a great invitation
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• Choose a relationship title that reflects your connection</li>
            <li>• Be honest about the relationship type you're proposing</li>
            <li>• Add a personal message to make the invitation more meaningful</li>
            <li>• Remember that they can accept, decline, or suggest changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InviteRelationship;