import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertTriangle,
  History,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'react-toastify';
import useRelationshipStore from '../store/relationshipStore';
import useAuthStore from '../store/authStore';

const RelationshipSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRelationship, getRelationship, updateRelationship, isLoading } = useRelationshipStore();
  
  const [settings, setSettings] = useState({
    privacy: 'private',
    notifications: {
      activities: true,
      milestones: true,
      terms: true,
      anniversaries: true
    },
    permissions: {
      viewHistory: false,
      editProfile: true,
      createActivities: true,
      createMilestones: true,
      createTerms: true
    },
    transparency: {
      shareLocation: false,
      shareContacts: false,
      allowHistoryAccess: false,
      requireMutualConsent: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      getRelationship(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentRelationship) {
      setSettings(currentRelationship.settings || settings);
    }
  }, [currentRelationship]);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    const result = await updateRelationship(id, { settings });
    if (result.success) {
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteRelationship = async () => {
    if (window.confirm('Are you sure you want to permanently delete this relationship? This action cannot be undone.')) {
      // For active relationships, we should end them instead of delete
      if (currentRelationship.status === 'active') {
        toast.error('Cannot delete an active relationship. Please end it first.');
        return;
      }
      
      const result = await deleteRelationship(id);
      if (result.success) {
        toast.success('Relationship deleted');
        navigate('/relationships');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentRelationship) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Relationship not found
          </h1>
          <Link
            to="/relationships"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to relationships
          </Link>
        </div>
      </div>
    );
  }

  const partner = currentRelationship.initiator._id === user?.id 
    ? currentRelationship.partner 
    : currentRelationship.initiator;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to={`/relationships/${id}`}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to relationship
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-4">
              <Settings className="h-6 w-6 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Relationship Settings
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {currentRelationship.title} with {partner.firstName} {partner.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-fade-in">
          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship Visibility
                </label>
                <select
                  value={settings.privacy}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, privacy: e.target.value }));
                    setHasChanges(true);
                  }}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="friends">Friends - Visible to mutual connections</option>
                  <option value="private">Private - Only visible to you two</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                      {key.charAt(0).toUpperCase() + key.slice(1)} notifications
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about {key} in this relationship
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Permissions
            </h3>
            
            <div className="space-y-4">
              {Object.entries(settings.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Allow partner to {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('permissions', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency & Trust */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Transparency & Trust
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Trust Features:</strong> These settings promote transparency and prevent cheating by allowing mutual visibility into relationship history and activities.
                </p>
              </div>

              {Object.entries(settings.transparency).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'allowHistoryAccess' && 'Allow partner to view your past relationship history'}
                      {key === 'requireMutualConsent' && 'Require both parties to agree before viewing sensitive information'}
                      {key === 'shareLocation' && 'Share your location during activities'}
                      {key === 'shareContacts' && 'Share relevant contact information'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('transparency', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship History Access */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <History className="h-5 w-5 mr-2" />
              Relationship History
            </h3>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-base font-semibold text-yellow-800 dark:text-yellow-200">
                      Transparency Policy
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      To maintain trust and prevent deception, partners can request access to view each other's relationship history. 
                      This includes past relationships, activities, and important milestones. Both parties must consent to share this information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Your History Status
                  </h4>
                  <div className="flex items-center space-x-2">
                    {settings.transparency.allowHistoryAccess ? (
                      <>
                        <Unlock className="h-5 w-5 text-green-500" />
                        <span className="text-base text-green-600 dark:text-green-400">Open to partner</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 text-red-500" />
                        <span className="text-base text-red-600 dark:text-red-400">Private</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Partner's History Status
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <span className="text-base text-gray-600 dark:text-gray-400">Request access to view</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-red-300 dark:border-red-700 p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </h3>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-sm">
                <h4 className="text-base font-semibold text-red-800 dark:text-red-200 mb-2">
                  Delete Relationship
                </h4>
                <p className="text-base text-red-700 dark:text-red-300 mb-3">
                  Permanently delete this relationship and all associated data. This action cannot be undone.
                  Note: Active relationships must be ended before they can be deleted.
                </p>
                <button
                  onClick={handleDeleteRelationship}
                  disabled={currentRelationship.status === 'active'}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Relationship
                </button>
                {currentRelationship.status === 'active' && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    Cannot delete an active relationship. Please end it first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="sticky bottom-4 bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  You have unsaved changes
                </p>
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipSettings;