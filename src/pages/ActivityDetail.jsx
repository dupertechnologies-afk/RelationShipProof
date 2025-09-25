import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Tag,
  Share2
} from 'lucide-react';
import { toast } from 'react-toastify';
import useActivityStore from '../store/activityStore';
import useAuthStore from '../store/authStore';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentActivity, 
    getActivity, 
    updateActivity,
    deleteActivity,
    addReaction,
    addComment,
    isLoading 
  } = useActivityStore();

  const [commentText, setCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    if (id) {
      getActivity(id);
    }
  }, [id]);

  const handleReaction = async (reactionType) => {
    const result = await addReaction(id, reactionType);
    if (result.success) {
      toast.success('Reaction added!');
    } else {
      toast.error(result.error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsAddingComment(true);
    const result = await addComment(id, commentText.trim());
    if (result.success) {
      setCommentText('');
      toast.success('Comment added!');
    } else {
      toast.error(result.error);
    }
    setIsAddingComment(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const result = await deleteActivity(id);
      if (result.success) {
        toast.success('Activity deleted');
        navigate('/activities');
      } else {
        toast.error(result.error);
      }
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'very_positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'positive': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'negative': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'very_negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'very_positive': return '😍';
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😕';
      case 'very_negative': return '😢';
      default: return '😐';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Activity not found
          </h1>
          <Link
            to="/activities"
            className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            ← Back to activities
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = currentActivity.createdBy._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/activities"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to activities
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentActivity.title}
                  </h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(currentActivity.mood)}`}>
                    <span className="mr-1">{getMoodEmoji(currentActivity.mood)}</span>
                    {currentActivity.mood.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-base">
                  {currentActivity.relationship.title} with {currentActivity.relationship.partner?.firstName} {currentActivity.relationship.partner?.lastName}
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-base">
                  {currentActivity.description}
                </p>
              </div>

              {isCreator && (
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200">
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
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Activity Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Activity Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                  <p className="text-base text-gray-900 dark:text-white">
                    {currentActivity.type}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                  <p className="text-base text-gray-900 dark:text-white">
                    {currentActivity.category.replace('_', ' ')}
                  </p>
                </div>

                {currentActivity.location?.name && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-900 dark:text-white">
                        {currentActivity.location.name}
                      </p>
                    </div>
                  </div>
                )}

                {currentActivity.duration && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-900 dark:text-white">
                        {formatDuration(currentActivity.duration)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created by</span>
                  <div className="flex items-center space-x-2">
                    {currentActivity.createdBy.avatar ? (
                      <img
                        src={currentActivity.createdBy.avatar}
                        alt={currentActivity.createdBy.fullName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-secondary-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {currentActivity.createdBy.firstName[0]}{currentActivity.createdBy.lastName[0]}
                        </span>
                      </div>
                    )}
                    <p className="text-base text-gray-900 dark:text-white">
                      {currentActivity.createdBy.firstName} {currentActivity.createdBy.lastName}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-base text-gray-900 dark:text-white">
                      {new Date(currentActivity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {currentActivity.tags && currentActivity.tags.length > 0 && (
                <div className="mt-6">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {currentActivity.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reactions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reactions
              </h3>
              
              <div className="flex space-x-2 mb-4">
                {['love', 'like', 'laugh', 'wow', 'sad', 'angry'].map((reactionType) => (
                  <button
                    key={reactionType}
                    onClick={() => handleReaction(reactionType)}
                    className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                  >
                    {reactionType === 'love' && '❤️'}
                    {reactionType === 'like' && '👍'}
                    {reactionType === 'laugh' && '😂'}
                    {reactionType === 'wow' && '😮'}
                    {reactionType === 'sad' && '😢'}
                    {reactionType === 'angry' && '😠'}
                  </button>
                ))}
              </div>

              {currentActivity.reactions && currentActivity.reactions.length > 0 && (
                <div className="space-y-3">
                  {currentActivity.reactions.map((reaction, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {reaction.user.avatar ? (
                        <img
                          src={reaction.user.avatar}
                          alt={reaction.user.fullName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-secondary-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {reaction.user.firstName[0]}{reaction.user.lastName[0]}
                          </span>
                        </div>
                      )}
                      <span className="text-base text-gray-700 dark:text-gray-300">
                        {reaction.user.firstName} reacted with {reaction.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(reaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Comments
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white py-2.5 px-3 transition-colors duration-200"
                      placeholder="Add a comment..."
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={!commentText.trim() || isAddingComment}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                      >
                        {isAddingComment ? 'Adding...' : 'Add Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              {currentActivity.comments && currentActivity.comments.length > 0 ? (
                <div className="space-y-4">
                  {currentActivity.comments.map((comment, index) => (
                    <div key={index} className="flex space-x-3">
                      {comment.user.avatar ? (
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.fullName}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {comment.user.firstName[0]}{comment.user.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-base font-medium text-gray-900 dark:text-white">
                              {comment.user.firstName} {comment.user.lastName}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-base text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in">
            {/* Participants */}
            {currentActivity.participants && currentActivity.participants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Participants
                </h3>
                <div className="space-y-3">
                  {currentActivity.participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {participant.user.avatar ? (
                        <img
                          src={participant.user.avatar}
                          alt={participant.user.fullName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {participant.user.firstName[0]}{participant.user.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {participant.user.firstName} {participant.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {participant.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share Activity
              </h3>
              <button className="w-full inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200">
                <Share2 className="h-5 w-5 mr-2" />
                Share Activity
              </button>
            </div>

            {/* Related Milestone */}
            {currentActivity.relatedMilestone && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Milestone
                </h3>
                <Link
                  to={`/milestones/${currentActivity.relatedMilestone._id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {currentActivity.relatedMilestone.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {currentActivity.relatedMilestone.status}
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;