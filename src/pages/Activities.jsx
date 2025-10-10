import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Heart,
  MessageCircle,
  Gift,
  Target,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import useActivityStore from '../store/activityStore';

const Activities = () => {
  const { activities, getAllActivities, isLoading } = useActivityStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');

  useEffect(() => {
    getAllActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesMood = moodFilter === 'all' || activity.mood === moodFilter;
    
    return matchesSearch && matchesType && matchesMood;
  });

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'conversation': return <MessageCircle className="h-4 w-4" />;
      case 'date': return <Heart className="h-4 w-4" />;
      case 'gift': return <Gift className="h-4 w-4" />;
      case 'achievement': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activities
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track and celebrate the moments that matter in your relationships
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/activities/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Activities</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.filter(a => a.mood === 'very_positive' || a.mood === 'positive').length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Positive</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activities.filter(a => {
                    const activityDate = new Date(a.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return activityDate >= weekAgo;
                  }).length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(activities.reduce((sum, a) => sum + (a.duration || 0), 0) / 60)}h
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="conversation">Conversation</option>
              <option value="date">Date</option>
              <option value="gift">Gift</option>
              <option value="achievement">Achievement</option>
              <option value="conflict">Conflict</option>
              <option value="resolution">Resolution</option>
              <option value="milestone">Milestone</option>
              <option value="memory">Memory</option>
              <option value="goal">Goal</option>
              <option value="other">Other</option>
            </select>

            {/* Mood Filter */}
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Moods</option>
              <option value="very_positive">Very Positive</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="very_negative">Very Negative</option>
            </select>
          </div>
        </div>

        {/* Activities List */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200`}>
                            {getTypeIcon(activity.type)}
                            <span className="ml-1">{activity.type}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(activity.mood)}`}>
                            <span className="mr-1">{getMoodEmoji(activity.mood)}</span>
                            {activity.mood.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
  {activity.relationship.title} with{' '}
  {activity.relationship.partner
    ? `${activity.relationship.partner.firstName} ${activity.relationship.partner.lastName}`
    : 'Unknown Partner'}
</p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {activity.description}
                  </p>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {activity.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location.name}</span>
                      </div>
                    )}
                    {activity.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(activity.duration)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>by {activity.createdBy.firstName}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {activity.tags && activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reactions and Comments */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {activity.reactions.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {activity.reactions.slice(0, 3).map((reaction, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800"
                                title={`${reaction.user.firstName} reacted with ${reaction.type}`}
                              >
                                ❤️
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.reactions.length}
                          </span>
                        </div>
                      )}
                      
                      {activity.comments.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <MessageCircle className="h-4 w-4" />
                          <span>{activity.comments.length} comment{activity.comments.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/activities/${activity._id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || typeFilter !== 'all' || moodFilter !== 'all' 
                ? 'No activities match your filters' 
                : 'No activities yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || typeFilter !== 'all' || moodFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start logging activities to track the moments that matter in your relationships.'
              }
            </p>
            {(!searchTerm && typeFilter === 'all' && moodFilter === 'all') && (
              <Link
                to="/activities/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Activity
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;