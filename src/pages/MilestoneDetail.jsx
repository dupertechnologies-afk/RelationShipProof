import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Calendar, 
  Users, 
  Trophy,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Upload,
  FileText,
  Image,
  Video,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import useMilestoneStore from '../store/milestoneStore';
import useAuthStore from '../store/authStore';

const MilestoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentMilestone, 
    getMilestone, 
    completeMilestone, 
    updateMilestone,
    deleteMilestone,
    addEvidence,
    isLoading 
  } = useMilestoneStore();

  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceData, setEvidenceData] = useState({
    type: 'note',
    url: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      getMilestone(id);
    }
  }, [id]);

  const handleComplete = async () => {
    const result = await completeMilestone(id);
    if (result.success) {
      toast.success('Milestone completed! 🎉');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      const result = await deleteMilestone(id);
      if (result.success) {
        toast.success('Milestone deleted');
        navigate('/milestones');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    const result = await addEvidence(id, evidenceData);
    if (result.success) {
      toast.success('Evidence added successfully!');
      setShowEvidenceForm(false);
      setEvidenceData({ type: 'note', url: '', description: '' });
    } else {
      toast.error(result.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'in_progress': return <Clock className="h-5 w-5" />;
      case 'pending': return <Target className="h-5 w-5" />;
      case 'failed': return <AlertCircle className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getEvidenceIcon = (type) => {
    switch (type) {
      case 'photo': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!currentMilestone) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Milestone not found
          </h1>
          <Link
            to="/milestones"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            ← Back to milestones
          </Link>
        </div>
      </div>
    );
  }

  const isOverdue = currentMilestone.targetDate && 
                   new Date(currentMilestone.targetDate) < new Date() && 
                   currentMilestone.status !== 'completed';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/milestones"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to milestones
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentMilestone.title}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentMilestone.status)}`}>
                    {getStatusIcon(currentMilestone.status)}
                    <span className="ml-2">{currentMilestone.status.replace('_', ' ')}</span>
                  </span>
                  {isOverdue && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {currentMilestone.relationship.title} with {currentMilestone.relationship.partner?.firstName} {currentMilestone.relationship.partner?.lastName}
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  {currentMilestone.description}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-3">
                {currentMilestone.status === 'in_progress' && (
                  <button
                    onClick={handleComplete}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>
                )}
                
                {currentMilestone.status !== 'completed' && (
                  <>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          <div className="lg:col-span-2 space-y-8">
            {/* Progress */}
            {currentMilestone.status !== 'pending' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Progress
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentMilestone.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        currentMilestone.status === 'completed' ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${currentMilestone.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Custom Criteria */}
                {currentMilestone.criteria?.customCriteria && currentMilestone.criteria.customCriteria.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Requirements
                    </h4>
                    <div className="space-y-2">
                      {currentMilestone.criteria.customCriteria.map((criterion, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            criterion.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}>
                            {criterion.completed && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`text-sm ${
                            criterion.completed 
                              ? 'text-gray-900 dark:text-white line-through' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {criterion.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Evidence */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Evidence
                </h3>
                {currentMilestone.status !== 'completed' && (
                  <button
                    onClick={() => setShowEvidenceForm(!showEvidenceForm)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Evidence
                  </button>
                )}
              </div>

              {/* Add Evidence Form */}
              {showEvidenceForm && (
                <form onSubmit={handleAddEvidence} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={evidenceData.type}
                        onChange={(e) => setEvidenceData(prev => ({ ...prev, type: e.target.value }))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="note">Note</option>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL (if applicable)
                      </label>
                      <input
                        type="url"
                        value={evidenceData.url}
                        onChange={(e) => setEvidenceData(prev => ({ ...prev, url: e.target.value }))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={evidenceData.description}
                      onChange={(e) => setEvidenceData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Describe this evidence..."
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Add Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEvidenceForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Evidence List */}
              {currentMilestone.evidence && currentMilestone.evidence.length > 0 ? (
                <div className="space-y-4">
                  {currentMilestone.evidence.map((evidence, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        {getEvidenceIcon(evidence.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {evidence.uploadedBy?.firstName} on {new Date(evidence.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {evidence.description}
                        </p>
                        {evidence.url && (
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            View Evidence →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No evidence added yet
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Details
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentMilestone.category.replace('_', ' ')}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</span>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentMilestone.difficulty}
                  </p>
                </div>

                {currentMilestone.targetDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Date</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(currentMilestone.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {currentMilestone.completedDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Date</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(currentMilestone.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(currentMilestone.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Rewards */}
            {currentMilestone.rewards && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Rewards
                </h3>
                <div className="space-y-3">
                  {currentMilestone.rewards.points > 0 && (
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentMilestone.rewards.points} points
                      </span>
                    </div>
                  )}
                  
                  {currentMilestone.rewards.certificate && (
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Certificate
                      </span>
                    </div>
                  )}
                  
                  {currentMilestone.rewards.badge && (
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentMilestone.rewards.badge} badge
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Participants */}
            {currentMilestone.participants && currentMilestone.participants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Participants
                </h3>
                <div className="space-y-3">
                  {currentMilestone.participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.user.firstName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {participant.user.firstName} {participant.user.lastName}
                        </p>
                        {participant.completedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Completed {new Date(participant.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetail;