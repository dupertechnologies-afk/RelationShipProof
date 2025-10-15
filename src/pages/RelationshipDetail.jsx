import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  Users, 
  Target, 
  Activity, 
  Award,
  Settings,
  MessageCircle,
  TrendingUp,
  Edit,
  ChevronDown,
  // History,
  // Lock,
  // Unlock,
  // Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import useRelationshipStore from '../store/relationshipStore';
import api from '../utils/api';

const RelationshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRelationship, getRelationship, relationships, isLoading, setCurrentRelationship, generateRelationshipCertificate, updateRelationship, requestTypeChange, acceptTypeChange, declineTypeChange, cancelTypeChange } = useRelationshipStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [typeChangeMessage, setTypeChangeMessage] = useState('');
  // const [isRequestingHistoryAccess, setIsRequestingHistoryAccess] = useState(false);
  // const [isGrantingOrDenyingHistoryAccess, setIsGrantingOrDenyingHistoryAccess] = useState(false);

  const handleGenerateCertificate = async () => {
    if (!id) return;
    const result = await generateRelationshipCertificate(id);
    if (result.success) {
      toast.success('Relationship certificate generated successfully!');
      navigate(`/certificates/${result.certificate._id}/display`);
    } else {
      toast.error(result.error || 'Failed to generate certificate.');
    }
  };

  useEffect(() => {
    if (id) {
      const existing = relationships.find(r => r._id === id);
      if (!existing) {
        getRelationship(id);
      } else {
        setCurrentRelationship(existing);
      }
    }
  }, [id, relationships, getRelationship, setCurrentRelationship]);

  // const handleRequestHistoryAccess = async () => {
  //   if (!relationshipToDisplay?._id) return;
  //   setIsRequestingHistoryAccess(true);
  //   try {
  //     await api.post(`/relationships/${relationshipToDisplay._id}/request-history-access`);
  //     toast.success('History access request sent!');
  //     getRelationship(id);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to send history access request.');
  //   } finally {
  //     setIsRequestingHistoryAccess(false);
  //   }
  // };

  // const handleGrantOrDenyHistoryAccess = async (granted) => {
  //   if (!relationshipToDisplay?._id) return;
  //   setIsGrantingOrDenyingHistoryAccess(true);
  //   try {
  //     await api.post(`/relationships/${relationshipToDisplay._id}/grant-history-access`, { granted });
  //     toast.success(granted ? 'History access granted!' : 'History access denied!');
  //     getRelationship(id);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to update history access.');
  //   } finally {
  //     setIsGrantingOrDenyingHistoryAccess(false);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  const relationshipToDisplay = currentRelationship || relationships.find(r => r._id === id);
  if (!relationshipToDisplay) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Relationship not found
          </h1>
          <Link
            to="/relationships"
            className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            ← Back to relationships
          </Link>
        </div>
      </div>
    );
  }

  const partner = relationshipToDisplay.initiator?._id === user?.id 
    ? relationshipToDisplay.partner 
    : relationshipToDisplay.initiator;

  const relationshipTypes = [
    'acquaintance', 'friend', 'close_friend', 'best_friend', 'romantic_interest', 'partner', 'engaged', 'married', 'family', 'mentor', 'mentee'
  ];

  const pendingTypeRequest = relationshipToDisplay.typeChangeRequest?.requested ? relationshipToDisplay.typeChangeRequest : null;
  const iRequestedTypeChange = pendingTypeRequest && pendingTypeRequest.requestedBy === user?.id;

  const handleSendTypeChange = async () => {
    if (!selectedType || selectedType === relationshipToDisplay.type) {
      toast.error('Please select a different relationship type');
      return;
    }
    const res = await requestTypeChange(relationshipToDisplay._id, { newType: selectedType, message: typeChangeMessage || undefined });
    if (res.success) {
      toast.success('Type change request sent');
      setShowTypeDropdown(false);
      setTypeChangeMessage('');
    } else {
      toast.error(res.error);
    }
  };

  // const hasHistoryAccess = relationshipToDisplay?.historyAccess?.granted;
  // const historyAccessRequestedByMe = relationshipToDisplay?.historyAccess?.requested && relationshipToDisplay?.historyAccess?.requestedBy?._id === user?._id;
  // const historyAccessRequestedByPartner = relationshipToDisplay?.historyAccess?.requested && relationshipToDisplay?.historyAccess?.requestedBy?._id === partner?._id && !relationshipToDisplay?.historyAccess?.granted;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A';
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-gray-600' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${color}`} />
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'terms', label: 'Terms', icon: MessageCircle },
    { id: 'certificates', label: 'Certificates', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/relationships"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to relationships
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                {partner?.avatar ? (
                  <img
                    src={partner.avatar}
                    alt={partner.fullName || 'Partner'}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-secondary-500 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">
                      {partner?.firstName?.[0] || ''}{partner?.lastName?.[0] || ''}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {relationshipToDisplay.title || 'Untitled Relationship'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-base">
                    with {partner?.firstName || 'N/A'} {partner?.lastName || ''}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(relationshipToDisplay.status)}`}>
                      {relationshipToDisplay.status || 'Unknown'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {relationshipToDisplay.type?.replace('_', ' ') || 'N/A'}
                    </span>
                  {relationshipToDisplay.typeChangeRequest?.requested && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Type change pending
                    </span>
                  )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button 
                  onClick={() => navigate(`/relationships/${relationshipToDisplay._id}/edit`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <Link
                  to={`/relationships/${relationshipToDisplay._id}/settings`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>

                {relationshipToDisplay.status === 'active' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowTypeDropdown(v => !v)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Change Type
                    </button>
                    {showTypeDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark py-4 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select new type</label>
                          <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 mb-3"
                          >
                            <option value="">Choose...</option>
                            {relationshipTypes.map(t => (
                              <option key={t} value={t}>{t.replace('_',' ')}</option>
                            ))}
                          </select>
                          <textarea
                            value={typeChangeMessage}
                            onChange={e => setTypeChangeMessage(e.target.value)}
                            rows={3}
                            placeholder="Optional message"
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2 mb-3"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSendTypeChange}
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Send Request
                            </button>
                            <button
                              onClick={() => { setShowTypeDropdown(false); setTypeChangeMessage(''); }}
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* History Access Buttons */}
                {/* {hasHistoryAccess ? (
                  <Link
                    to={`/history/${partner?._id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Link>
                ) : historyAccessRequestedByMe ? (
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-yellow-700 dark:text-yellow-400 bg-white dark:bg-gray-800 cursor-default transition-colors duration-200"
                    disabled
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    History Request Sent
                  </button>
                ) : historyAccessRequestedByPartner ? (
                  <>
                    <button
                      onClick={() => handleGrantOrDenyHistoryAccess(true)}
                      disabled={isGrantingOrDenyingHistoryAccess}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Grant Access
                    </button>
                    <button
                      onClick={() => handleGrantOrDenyHistoryAccess(false)}
                      disabled={isGrantingOrDenyingHistoryAccess}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Deny Access
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRequestHistoryAccess}
                    disabled={isRequestingHistoryAccess}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Request History Access
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
        {/* End Header */}

        {/* Certificate Button */}
        <div className="mb-8 flex justify-end">
          {relationshipToDisplay.latestCertificate ? (
            <Link
              to={`/certificates/${relationshipToDisplay.latestCertificate._id}/display`}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Award className="h-4 w-4 mr-2" />
              View Relationship Certificate
            </Link>
          ) : (
            relationshipToDisplay.status === 'active' && (
              <button
                onClick={handleGenerateCertificate}
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Award className="h-4 w-4 mr-2" />
                Generate Relationship Certificate
              </button>
            )
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Trust Level"
            value={`${relationshipToDisplay.stats?.trustLevel || 50}%`}
            color="text-secondary-500"
          />
          <StatCard
            icon={Activity}
            title="Total Activities"
            value={relationshipToDisplay.stats?.totalActivities || 0}
            color="text-secondary-500"
          />
          <StatCard
            icon={Target}
            title="Milestones"
            value={relationshipToDisplay.stats?.milestonesAchieved || 0}
            subtitle="completed"
            color="text-secondary-500"
          />
          <StatCard
            icon={Calendar}
            title="Duration"
            value={relationshipToDisplay.duration || 0}
            subtitle="days"
            color="text-orange-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'border-secondary-500 text-secondary-600 dark:text-secondary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <Icon 
                      className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === tab.id
                        ? 'text-secondary-600 dark:text-secondary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } transition-colors duration-200`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {pendingTypeRequest && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {iRequestedTypeChange ? 'You requested' : `${partner?.firstName || 'Partner'} requested`} changing type to <strong>{pendingTypeRequest.newType?.replace('_',' ')}</strong>.
                      </p>
                      {pendingTypeRequest.message && (
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">Message: {pendingTypeRequest.message}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {iRequestedTypeChange ? (
                        <button
                          onClick={async () => {
                            const res = await cancelTypeChange(relationshipToDisplay._id);
                            if (res.success) toast.success('Request canceled'); else toast.error(res.error);
                          }}
                          className="px-3 py-1.5 rounded-md text-sm border border-blue-300 text-blue-700 dark:text-blue-300 bg-white dark:bg-transparent hover:bg-blue-100"
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={async () => {
                              const res = await acceptTypeChange(relationshipToDisplay._id);
                              if (res.success) toast.success('Type changed'); else toast.error(res.error);
                            }}
                            className="px-3 py-1.5 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              const res = await declineTypeChange(relationshipToDisplay._id);
                              if (res.success) toast.success('Request declined'); else toast.error(res.error);
                            }}
                            className="px-3 py-1.5 rounded-md text-sm border border-blue-300 text-blue-700 dark:text-blue-300 bg-white dark:bg-transparent hover:bg-blue-100"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {/* Description */}
                {relationshipToDisplay.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base">
                      {relationshipToDisplay.description}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2.5 h-2.5 bg-secondary-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          Relationship started
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(relationshipToDisplay.startDate)}
                        </p>
                      </div>
                    </div>
                    {relationshipToDisplay.acceptedDate && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2.5 h-2.5 bg-secondary-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            Relationship accepted
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(relationshipToDisplay.acceptedDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    {relationshipToDisplay.stats?.lastInteraction && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2.5 h-2.5 bg-secondary-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            Last interaction
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(relationshipToDisplay.stats.lastInteraction)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Fields */}
                {relationshipToDisplay.customFields && Object.keys(relationshipToDisplay.customFields).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relationshipToDisplay.customFields.anniversary && (
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            Anniversary
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(relationshipToDisplay.customFields.anniversary)}
                          </p>
                        </div>
                      )}
                      {relationshipToDisplay.customFields.meetingPlace && (
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            Where we met
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {relationshipToDisplay.customFields.meetingPlace}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="text-center py-12 animate-fade-in">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
                  Start logging activities to track your relationship journey.
                </p>
                <Link
                  to={`/activities/create?relationshipId=${relationshipToDisplay._id}`}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Log Activity
                </Link>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="text-center py-12 animate-fade-in">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No milestones yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
                  Create milestones to set goals and celebrate achievements together.
                </p>
                <Link
                  to={`/milestones/create?relationshipId=${relationshipToDisplay._id}`}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Create Milestone
                </Link>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="text-center py-12 animate-fade-in">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No terms yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
                  Create mutual agreements to establish clear expectations.
                </p>
                <Link
                  to={`/terms/create?relationshipId=${relationshipToDisplay._id}`}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Create Agreement
                </Link>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="text-center py-12 animate-fade-in">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No certificates yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
                  Complete milestones and activities to earn certificates.
                </p>
                <Link
                  to="/certificates"
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  View All Certificates
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDetail;