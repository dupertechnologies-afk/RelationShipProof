import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Heart,
  Users,
  Target,
  MessageCircle,
  Award,
  Calendar,
  AlertCircle,
  Unlock,
  Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import useNotificationStore from '../store/notificationStore';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    isLoading 
  } = useNotificationStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.status === 'unread';
    if (filter === 'action_required') return notification.actionRequired;
    return notification.category === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'relationship_invite':
      case 'relationship_accepted':
      case 'relationship_declined':
        return <Users className="h-5 w-5" />;
      case 'history_access_request':
        return <Bell className="h-5 w-5" />;
      case 'history_access_granted':
        return <Unlock className="h-5 w-5" />;
      case 'history_access_denied':
        return <Lock className="h-5 w-5" />;
      case 'milestone_achieved':
      case 'milestone_reminder':
        return <Target className="h-5 w-5" />;
      case 'activity_added':
        return <Heart className="h-5 w-5" />;
      case 'term_proposed':
      case 'term_agreed':
      case 'term_violated':
        return <MessageCircle className="h-5 w-5" />;
      case 'certificate_earned':
        return <Award className="h-5 w-5" />;
      case 'anniversary_reminder':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (priority === 'high') return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
    
    switch (type) {
      case 'relationship_invite':
      case 'relationship_accepted':
      case 'history_access_request':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'history_access_granted':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'history_access_denied':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'milestone_achieved':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'certificate_earned':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'term_violated':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (id) => {
    const result = await markAsRead(id);
    if (result.success) {
      toast.success('Notification marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      toast.success('All notifications marked as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    const result = await deleteNotification(id);
    if (result.success) {
      toast.success('Notification deleted');
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
              Stay updated with your relationship activities and invitations
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {unreadCount} unread
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'action_required', label: 'Action Required' },
              { value: 'relationship', label: 'Relationships' },
              { value: 'milestone', label: 'Milestones' },
              { value: 'activity', label: 'Activities' },
              { value: 'achievement', label: 'Achievements' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  filter === filterOption.value
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border hover:shadow-md transition-shadow duration-200 animate-fade-in ${
                  notification.status === 'unread' 
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-base font-semibold ${
                              notification.status === 'unread' 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h3>
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {notification.actionRequired && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            {notification.sender && (
                              <div className="flex items-center space-x-1">
                                {notification.sender.avatar ? (
                                  <img src={notification.sender.avatar} alt={notification.sender.firstName} className="h-5 w-5 rounded-full object-cover" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                    {notification.sender.firstName[0]}
                                  </div>
                                )}
                                <span>{notification.sender.firstName} {notification.sender.lastName}</span>
                              </div>
                            )}
                            <span>{formatTimeAgo(notification.createdAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.status === 'unread' && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="p-2 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="mt-3 flex space-x-2">
                          {notification.actions.map((action, index) => (
                            <Link
                              key={index}
                              to={action.url}
                              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                                action.type === 'accept'
                                  ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                                  : action.type === 'decline'
                                  ? 'border-gray-300 dark:border-gray-600 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700'
                                  : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {action.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'all' 
                ? 'No notifications yet' 
                : `No ${filter.replace('_', ' ')} notifications`
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {filter === 'all'
                ? 'When you have relationship activities, invitations, or achievements, they\'ll appear here.'
                : 'Try selecting a different filter to see other notifications.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;