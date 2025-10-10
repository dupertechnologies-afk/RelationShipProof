import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Calendar, 
  Users, 
  Check,
  AlertTriangle,
  Edit,
  Trash2,
  FileText,
  Clock,
  Flag
} from 'lucide-react';
import { toast } from 'react-toastify';
import useTermStore from '../store/termStore';
import useAuthStore from '../store/authStore';

const TermDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentTerm, 
    getTerm, 
    agreeTerm, 
    updateTerm,
    deleteTerm,
    reportViolation,
    isLoading 
  } = useTermStore();

  const [signature, setSignature] = useState('');
  const [showViolationForm, setShowViolationForm] = useState(false);
  const [violationData, setViolationData] = useState({
    description: '',
    severity: 'minor'
  });

  useEffect(() => {
    if (id) {
      getTerm(id);
    }
  }, [id]);

  const handleAgree = async (e) => {
    e.preventDefault();
    const result = await agreeTerm(id, signature || `${user?.firstName} ${user?.lastName}`);
    if (result.success) {
      toast.success('You have agreed to this term!');
      setSignature('');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      const result = await deleteTerm(id);
      if (result.success) {
        toast.success('Term deleted');
        navigate('/terms');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleReportViolation = async (e) => {
    e.preventDefault();
    const result = await reportViolation(id, violationData);
    if (result.success) {
      toast.success('Violation reported');
      setShowViolationForm(false);
      setViolationData({ description: '', severity: 'minor' });
    } else {
      toast.error(result.error);
    }
  };

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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'minor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentTerm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Term not found
          </h1>
          <Link
            to="/terms"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to terms
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = currentTerm.createdBy._id === user?.id;
  const hasUserAgreed = currentTerm.agreedBy?.some(agreement => agreement.user._id === user?.id);
  const canAgree = currentTerm.status === 'proposed' && !hasUserAgreed;
  const isExpired = currentTerm.expiresAt && new Date(currentTerm.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentTerm.title}
                  </h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentTerm.status)}`}>
                    {currentTerm.status === 'agreed' && <Check className="h-3 w-3 mr-1" />}
                    {currentTerm.status === 'proposed' && <Clock className="h-3 w-3 mr-1" />}
                    {currentTerm.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(currentTerm.priority)}`}>
                    {currentTerm.priority} priority
                  </span>
                  {isExpired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Expired
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-base">
                  {currentTerm.relationship.title} with {currentTerm.relationship.partner?.firstName} {currentTerm.relationship.partner?.lastName}
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-base">
                  {currentTerm.description}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-3">
                {canAgree && (
                  <button
                    onClick={() => document.getElementById('agree-form').scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Agree to Term
                  </button>
                )}
                
                {currentTerm.status === 'agreed' && (
                  <button
                    onClick={() => setShowViolationForm(!showViolationForm)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Violation
                  </button>
                )}

                {isCreator && currentTerm.status !== 'agreed' && (
                  <>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Agreement Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Agreement Status
              </h3>
              
              <div className="space-y-4">
                {currentTerm.agreedBy && currentTerm.agreedBy.length > 0 ? (
                  currentTerm.agreedBy.map((agreement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {agreement.user.firstName} {agreement.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Agreed on {new Date(agreement.agreedAt).toLocaleDateString()}
                        </p>
                        {agreement.signature && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            Signature: "{agreement.signature}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No agreements yet
                  </p>
                )}
              </div>

              {/* Agreement Form */}
              {canAgree && (
                <div id="agree-form" className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Agree to this term
                  </h4>
                  <form onSubmit={handleAgree} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Digital Signature (optional)
                      </label>
                      <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder={`${user?.firstName} ${user?.lastName}`}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      I Agree to This Term
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Violation Report Form */}
            {showViolationForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Report Violation
                </h3>
                <form onSubmit={handleReportViolation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity
                    </label>
                    <select
                      value={violationData.severity}
                      onChange={(e) => setViolationData(prev => ({ ...prev, severity: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
                    >
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="major">Major</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={violationData.description}
                      onChange={(e) => setViolationData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
                      placeholder="Describe the violation..."
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report Violation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowViolationForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Violations */}
            {currentTerm.violations && currentTerm.violations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Reported Violations
                </h3>
                <div className="space-y-4">
                  {currentTerm.violations.map((violation, index) => (
                    <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                            {violation.severity}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Reported by {violation.reportedBy.firstName} on {new Date(violation.reportedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {violation.resolved && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        {violation.description}
                      </p>
                      {violation.resolution && (
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Resolution:</strong> {violation.resolution}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in">
            {/* Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Details
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                  <p className="text-base text-gray-900 dark:text-white">
                    {currentTerm.category.replace('_', ' ')}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</span>
                  <p className="text-base text-gray-900 dark:text-white">
                    {currentTerm.priority}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created by</span>
                  <div className="flex items-center space-x-2">
                    {currentTerm.createdBy.avatar ? (
                      <img
                        src={currentTerm.createdBy.avatar}
                        alt={currentTerm.createdBy.fullName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {currentTerm.createdBy.firstName[0]}{currentTerm.createdBy.lastName[0]}
                        </span>
                      </div>
                    )}
                    <p className="text-base text-gray-900 dark:text-white">
                      {currentTerm.createdBy.firstName} {currentTerm.createdBy.lastName}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                  <p className="text-base text-gray-900 dark:text-white">
                    {new Date(currentTerm.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {currentTerm.expiresAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expires</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className={`text-base ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {new Date(currentTerm.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agreement Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Agreement Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Agreed</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {currentTerm.agreedBy?.length || 0} of 2
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${((currentTerm.agreedBy?.length || 0) / 2) * 100}%` }}
                  ></div>
                </div>
                {currentTerm.status === 'agreed' && (
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                    ✓ Fully agreed by all parties
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermDetail;