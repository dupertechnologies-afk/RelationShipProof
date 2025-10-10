
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Target, Calendar, Trophy, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import useRelationshipStore from '../store/relationshipStore';
import useMilestoneStore from '../store/milestoneStore';

const CreateMilestone = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { relationships } = useRelationshipStore();
  const { createMilestone, isLoading } = useMilestoneStore();
  
  const [formData, setFormData] = useState({
    relationshipId: searchParams.get('relationshipId') || '',
    title: '',
    description: '',
    category: 'communication',
    type: 'manual',
    targetDate: '',
    difficulty: 'medium',
    rewards: {
      points: 50,
      certificate: false,
      badge: ''
    }
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
    { value: 'time_based', label: 'Time Based' },
    { value: 'activity_based', label: 'Activity Based' },
    { value: 'trust_based', label: 'Trust Based' },
    { value: 'communication', label: 'Communication' },
    { value: 'commitment', label: 'Commitment' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'custom', label: 'Custom' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', points: 25 },
    { value: 'medium', label: 'Medium', points: 50 },
    { value: 'hard', label: 'Hard', points: 100 },
    { value: 'expert', label: 'Expert', points: 200 }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.relationshipId || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await createMilestone(formData);
    
    if (result.success) {
      toast.success('Milestone created successfully!');
      navigate('/milestones');
    } else {
      toast.error(result.error || 'Failed to create milestone');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/milestones"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to milestones
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Milestone
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
              Define a new goal and track your progress in your relationship
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
                Milestone Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="e.g., First Anniversary Celebration"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="Describe the milestone and its significance..."
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Provide details about what this milestone entails.
              </p>
            </div>

            {/* Target Date */}
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                The date you aim to achieve this milestone.
              </p>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  {milestoneStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
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
                  {priorities.find(p => p.value === formData.priority)?.label} priority milestones require more attention.
                </p>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Rewards
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="certificate"
                    name="rewards.certificate"
                    type="checkbox"
                    checked={formData.rewards.certificate}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="certificate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    <Trophy className="inline h-4 w-4 mr-1" />
                    Award certificate upon completion
                  </label>
                </div>
                
                <div>
                  <label htmlFor="badge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Badge Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="badge"
                    name="rewards.badge"
                    value={formData.rewards.badge}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                    placeholder="e.g., Communication Champion"
                  />
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
                    Creating milestone...
                  </div>
                ) : (
                  <>
                    <Award className="h-5 w-5 mr-2" />
                    Create Milestone
                  </>
                )}
              </button>
              
              <Link
                to="/milestones"
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

export default CreateMilestone;