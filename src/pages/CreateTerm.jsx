
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import useRelationshipStore from '../store/relationshipStore';
import useTermStore from '../store/termStore';

const CreateTerm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { relationships } = useRelationshipStore();
  const { createTerm, isLoading } = useTermStore();
  
  const [formData, setFormData] = useState({
    relationshipId: searchParams.get('relationshipId') || '',
    title: '',
    description: '',
    category: 'communication',
    priority: 'medium',
    expiresAt: ''
  });

  useEffect(() => {
    // Pre-select relationship if passed via URL params
    const relationshipId = searchParams.get('relationshipId');
    if (relationshipId) {
      setFormData(prev => ({
        ...prev,
        relationshipId
      }));
    }
  }, [searchParams]);

  const categories = [
    { value: 'communication', label: 'Communication' },
    { value: 'boundaries', label: 'Boundaries' },
    { value: 'expectations', label: 'Expectations' },
    { value: 'goals', label: 'Goals' },
    { value: 'activities', label: 'Activities' },
    { value: 'conflict_resolution', label: 'Conflict Resolution' },
    { value: 'commitment', label: 'Commitment' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.relationshipId || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await createTerm(formData);
    
    if (result.success) {
      toast.success('Agreement created successfully!');
      navigate('/terms');
    } else {
      toast.error(result.error || 'Failed to create agreement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/terms"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to terms
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Agreement
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
              Establish mutual terms and expectations in your relationship
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Relationship Selection */}
            <div>
              <label htmlFor="relationshipId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship *
              </label>
              <select
                id="relationshipId"
                name="relationshipId"
                required
                value={formData.relationshipId}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              >
                <option value="">Select a relationship</option>
                {relationships.filter(r => r.status === 'active').map((relationship) => (
                  <option key={relationship._id} value={relationship._id}>
                    {relationship.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agreement Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="e.g., Weekly Check-ins"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="Describe the terms and expectations in detail..."
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Be specific about what both parties agree to do or not do.
              </p>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {priorities.find(p => p.value === formData.priority)?.label} priority agreements require more attention.
                </p>
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Leave blank for permanent agreements. Set a date for temporary or trial agreements.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-sm">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-yellow-800 dark:text-yellow-200">
                    Important Notice
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    This agreement will be sent to your relationship partner for review and approval. 
                    Both parties must agree before the terms become active. You can modify the agreement 
                    until both parties have agreed to it.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating agreement...
                  </div>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Create Agreement
                  </>
                )}
              </button>
              
              <Link
                to="/terms"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTerm;