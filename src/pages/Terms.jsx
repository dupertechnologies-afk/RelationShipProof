import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Filter, 
  Check,
  Clock,
  AlertTriangle,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import useTermStore from '../store/termStore';

const Terms = () => {
  const { terms, getAllTerms, agreeTerm, isLoading } = useTermStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    getAllTerms();
  }, []);

  const handleAgreeTerm = async (id) => {
    const result = await agreeTerm(id);
    if (result.success) {
      toast.success('You have agreed to this term!');
    } else {
      toast.error(result.error);
    }
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = !searchTerm || 
      term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || term.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || term.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'agreed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'proposed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'modified': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'agreed': return <Check className="h-4 w-4" />;
      case 'proposed': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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
              Terms & Agreements
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
              Create mutual agreements to establish clear expectations in your relationships
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/terms/create"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agreement
            </Link>
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
                placeholder="Search terms..."
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
              <option value="proposed">Proposed</option>
              <option value="agreed">Agreed</option>
              <option value="modified">Modified</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            >
              <option value="all">All Categories</option>
              <option value="communication">Communication</option>
              <option value="boundaries">Boundaries</option>
              <option value="expectations">Expectations</option>
              <option value="goals">Goals</option>
              <option value="activities">Activities</option>
              <option value="conflict_resolution">Conflict Resolution</option>
              <option value="commitment">Commitment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Terms List */}
        {filteredTerms.length > 0 ? (
          <div className="space-y-6">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {term.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(term.status)}`}>
                            {getStatusIcon(term.status)}
                            <span className="ml-1">{term.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(term.priority)}`}>
                            {term.priority} priority
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {term.relationship.title} with {term.relationship.partner.firstName} {term.relationship.partner.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
                    {term.description}
                  </p>

                  {/* Agreement Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {term.agreedBy.length} of 2 agreed
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {term.agreedBy.map((agreement, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800"
                            title={`${agreement.user.firstName} agreed on ${new Date(agreement.agreedAt).toLocaleDateString()}`}
                          >
                            {agreement.user.firstName[0]}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {term.status === 'proposed' && term.agreedBy.length === 1 && (
                        <button 
                          onClick={() => handleAgreeTerm(term._id)}
                          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Agree
                        </button>
                      )}
                      <Link
                        to={`/terms/${term._id}`}
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
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'No terms match your filters' 
                : 'No terms yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create mutual agreements to establish clear expectations in your relationships.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
              <Link
                to="/terms/create"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Agreement
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;