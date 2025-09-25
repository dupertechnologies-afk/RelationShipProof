import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import useMilestoneStore from '../store/milestoneStore';

const Milestones = () => {
  const { milestones, getAllMilestones, completeMilestone, isLoading } = useMilestoneStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    getAllMilestones();
  }, []);

  const handleCompleteMilestone = async (id) => {
    const result = await completeMilestone(id);
    if (result.success) {
      toast.success('Milestone completed! 🎉');
    } else {
      toast.error(result.error);
    }
  };

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = !searchTerm || 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || milestone.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <Target className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const isOverdue = (milestone) => {
    return milestone.targetDate && 
           new Date(milestone.targetDate) < new Date() && 
           milestone.status !== 'completed';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Milestones
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
              Set goals and celebrate achievements in your relationships
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/milestones/create"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Milestone
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-secondary-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {milestones.length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-secondary-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {milestones.filter(m => m.status === 'completed').length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-secondary-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {milestones.filter(m => m.status === 'in_progress').length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {milestones.filter(m => isOverdue(m)).length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search milestones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            >
              <option value="all">All Categories</option>
              <option value="time_based">Time Based</option>
              <option value="activity_based">Activity Based</option>
              <option value="trust_based">Trust Based</option>
              <option value="communication">Communication</option>
              <option value="commitment">Commitment</option>
              <option value="achievement">Achievement</option>
              <option value="celebration">Celebration</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Milestones List */}
        {filteredMilestones.length > 0 ? (
          <div className="space-y-6">
            {filteredMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border hover:shadow-md transition-shadow duration-200 ${
                  isOverdue(milestone) 
                    ? 'border-red-300 dark:border-red-700' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                            {getStatusIcon(milestone.status)}
                            <span className="ml-1">{milestone.status.replace('_', ' ')}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(milestone.difficulty)}`}>
                            {milestone.difficulty}
                          </span>
                          {isOverdue(milestone) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {milestone.relationship.title} with {milestone.relationship.partner.firstName} {milestone.relationship.partner.lastName}
                      </p>
                    </div>
                    {milestone.rewards.certificate && (
                      <Trophy className="h-6 w-6 text-yellow-500" title="Certificate reward" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
                    {milestone.description}
                  </p>

                  {/* Progress Bar */}
                  {milestone.status !== 'pending' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progress
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {milestone.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            milestone.status === 'completed' ? 'bg-secondary-500' : 'bg-secondary-500'
                          }`}
                          style={{ width: `${milestone.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {milestone.status === 'completed' && milestone.completedDate
                            ? `Completed ${new Date(milestone.completedDate).toLocaleDateString()}`
                            : milestone.targetDate
                            ? `Due ${new Date(milestone.targetDate).toLocaleDateString()}`
                            : 'No due date'
                          }
                        </span>
                      </div>
                      {milestone.rewards.points > 0 && (
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{milestone.rewards.points} points</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {milestone.status === 'in_progress' && (
                        <button 
                          onClick={() => handleCompleteMilestone(milestone._id)}
                          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </button>
                      )}
                      <Link
                        to={`/milestones/${milestone._id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'No milestones match your filters' 
                : 'No milestones yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create milestones to set goals and celebrate achievements in your relationships.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
              <Link
                to="/milestones/create"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Milestone
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Milestones;