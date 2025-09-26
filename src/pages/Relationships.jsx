import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Heart,
  Check,
  X,
  MoreVertical,
  Settings,
  // History,
  UserX,
  Archive,
  UserPlus,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import useRelationshipStore from '../store/relationshipStore';
import api from '../utils/api';

const Relationships = () => {
  const { user } = useAuthStore();
  const { 
    relationships, 
    getRelationships, 
    acceptRelationship, 
    declineRelationship,
    requestBreakup,
    confirmBreakup,
    updateRelationship,
    isLoading 
  } = useRelationshipStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showBreakupModal, setShowBreakupModal] = useState(null);
  // const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [breakupReason, setBreakupReason] = useState('');
  const [showConfirmBreakupModal, setShowConfirmBreakupModal] = useState(null);

  useEffect(() => {
    getRelationships();
  }, []);

  const handleAcceptRelationship = async (id) => {
    const result = await acceptRelationship(id);
    if (result.success) {
      toast.success('Relationship accepted successfully!');
    } else {
      toast.error(result.error || 'Failed to accept relationship');
    }
  };

  const handleDeclineRelationship = async (id) => {
    const result = await declineRelationship(id);
    if (result.success) {
      toast.success('Relationship declined');
    } else {
      toast.error(result.error || 'Failed to decline relationship');
    }
  };

  const handleBreakup = async (relationshipId) => {
    if (!breakupReason.trim()) {
      toast.error('Please provide a reason for ending the relationship');
      return;
    }

    const result = await requestBreakup(relationshipId, { 
      status: 'ended',
      endDate: new Date(),
      endReason: breakupReason.trim()
    });
    
    if (result.success) {
      toast.success('Relationship ended');
      setShowBreakupModal(null);
      setBreakupReason('');
    } else {
      toast.error(result.error);
    }
  };

  const handleRequestBreakup = async (relationshipId) => {
    const result = await requestBreakup(relationshipId);
    if (result.success) {
      toast.success('Breakup request sent successfully! Your partner needs to confirm.');
      setActiveDropdown(null);
    } else {
      toast.error(result.error || 'Failed to send breakup request');
    }
  };

  const handleConfirmBreakup = async (relationshipId) => {
    const result = await confirmBreakup(relationshipId);
    if (result.success) {
      toast.success('Breakup confirmed. The relationship has ended.');
      setShowConfirmBreakupModal(null);
    } else {
      toast.error(result.error || 'Failed to confirm breakup');
    }
  };

  const handleArchiveRelationship = async (relationshipId) => {
    const result = await updateRelationship(relationshipId, { 
      status: 'archived',
      archivedDate: new Date()
    });
    
    if (result.success) {
      toast.success('Relationship archived');
    } else {
      toast.error(result.error);
    }
  };

  // const handleRequestHistoryAccess = async (relationshipId) => {
  //   try {
  //     await api.post(`/relationships/${relationshipId}/request-history-access`);
  //     toast.success('History access request sent to your partner!');
  //     getRelationships(); // Re-fetch relationships to update the UI
  //     setShowHistoryModal(null);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to request history access.');
  //   }
  // };

  const filteredRelationships = relationships.filter(relationship => {
    const partner = relationship.initiator._id === user?.id 
      ? relationship.partner 
      : relationship.initiator;
    
    // const historyAccessRequestedByPartner = relationship.historyAccess?.requested && relationship.historyAccess?.requestedBy?._id === partner._id;

    const matchesSearch = !searchTerm || 
      relationship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      // (statusFilter === 'incoming_history_request' ? historyAccessRequestedByPartner : 
      relationship.status === statusFilter;
    const matchesType = typeFilter === 'all' || relationship.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'requested_breakup': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'romantic_interest':
      case 'partner':
      case 'engaged':
      case 'married':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'best_friend':
      case 'close_friend':
      case 'family':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'mentor':
      case 'mentee':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-16 dark:bg-gray-900 animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relationships
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
            Manage your connections and build meaningful relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/relationships/invite"
            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Someone
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
              placeholder="Search relationships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            />
          </div>
  
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="ended">Ended</option>
            {/* <option value="incoming_history_request">Incoming History Requests</option> */}
          </select>
  
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
          >
            <option value="all">All Types</option>
            <option value="acquaintance">Acquaintance</option>
            <option value="friend">Friend</option>
            <option value="close_friend">Close Friend</option>
            <option value="best_friend">Best Friend</option>
            <option value="romantic_interest">Romantic Interest</option>
            <option value="partner">Partner</option>
            <option value="engaged">Engaged</option>
            <option value="married">Married</option>
            <option value="family">Family</option>
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
          </select>
        </div>
      </div>
  
      {/* Relationships Grid */}
      {filteredRelationships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRelationships.map((relationship) => {
            const partner = relationship.initiator._id === user?.id 
              ? relationship.partner 
              : relationship.initiator;
            const isInvitee = relationship.partner._id === user?.id;
            // const hasHistoryAccess = relationship.historyAccess?.granted;
            // const historyAccessRequestedByMe = relationship.historyAccess?.requested && relationship.historyAccess?.requestedBy?._id === user?.id;
            // const historyAccessRequestedByPartner = relationship.historyAccess?.requested && relationship.historyAccess?.requestedBy?._id === partner._id;
            
            return (
              <div
                key={relationship._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {partner.avatar ? (
                        <img
                          src={partner.avatar}
                          alt={partner.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-base font-medium">
                            {partner.firstName?.[0]}{partner.lastName?.[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {relationship.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          with {partner.firstName} {partner.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === relationship._id ? null : relationship._id)}
                        className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeDropdown === relationship._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark py-1 z-50 border border-gray-200 dark:border-gray-700 animate-pop-in">
                          <Link
                            to={`/relationships/${relationship._id}/settings`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Link>
                          
                          {/* {hasHistoryAccess ? (
                            <Link
                              to={`/history/${partner._id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <History className="h-4 w-4 mr-2" />
                              View History
                            </Link>
                          ) : historyAccessRequestedByMe ? (
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400 cursor-default"
                              disabled
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              History Request Sent
                            </button>
                          ) : historyAccessRequestedByPartner ? (
                            <Link
                              to={`/history/${partner._id}`}
                              className="flex items-center px-4 py-2 text-sm text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <History className="h-4 w-4 mr-2" />
                              Review History Request
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                // handleRequestHistoryAccess(relationship._id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <History className="h-4 w-4 mr-2" />
                              Request History Access
                            </button>
                          )} */}
                          
                          {relationship.status === 'active' && (
                            <button
                              onClick={() => {
                                handleRequestBreakup(relationship._id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Request Breakup
                            </button>
                          )}
                          
                          {relationship.status === 'requested_breakup' && relationship.breakupRequestedBy !== user?.id && (
                            <button
                              onClick={() => {
                                setShowConfirmBreakupModal(relationship._id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Confirm Breakup
                            </button>
                          )}
                          
                          {relationship.status === 'ended' && (
                            <button
                              onClick={() => {
                                handleArchiveRelationship(relationship._id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
  
                  {/* Status and Type */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(relationship.status)}`}>
                      {relationship.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(relationship.type)}`}>
                      {relationship.type.replace('_', ' ')}
                    </span>
                  </div>
  
                  {/* Stats */}
                  {/* <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Trust Level</span>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${relationship.stats?.trustLevel || 50}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-900 dark:text-white">
                          {relationship.stats?.trustLevel || 50}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Activities</span>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {relationship.stats?.totalActivities || 0}
                      </p>
                    </div>
                  </div> */}
  
                  <div className="flex space-x-2 mt-4">
                    {relationship.status === 'pending' && isInvitee ? (
                      <>
                        <button
                          onClick={() => handleAcceptRelationship(relationship._id)}
                          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRelationship(relationship._id)}
                          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </>
                    ) : (
<div></div>                      // <Link
                      //   to={`/relationships/${relationship._id}`}
                      //   className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      // >
                      //   View Details
                      // </Link>
                    )}
                  </div>
  
                  {/* Pending indicator */}
                  {relationship.status === 'pending' && !isInvitee && (
                    <div className="mt-3 flex items-center text-yellow-600 dark:text-yellow-400">
                      <Clock className="h-4 w-4 mr-1" />
                      Waiting for response
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'No relationships match your filters' 
              : 'No relationships yet'
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Start building meaningful connections by inviting someone special.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
            <Link
              to="/relationships/invite"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Someone
            </Link>
          )}
        </div>
      )}
  
      {/* Breakup Modal */}
      {showBreakupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 animate-slide-up">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                End Relationship
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This action will end the relationship. Please provide a reason for transparency.
              </p>
              <textarea
                value={breakupReason}
                onChange={(e) => setBreakupReason(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-3 transition-colors duration-200"
                placeholder="Reason for ending the relationship..."
                required
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleBreakup(showBreakupModal)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  End Relationship
                </button>
                <button
                  onClick={() => {
                    setShowBreakupModal(null);
                    setBreakupReason('');
                  }}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* History Access Modal */}
      {/* {showHistoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 animate-slide-up">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Request History Access
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                To view the complete relationship history, you need permission from your partner. This ensures transparency and mutual consent.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>What you'll see:</strong> Past relationships, activities, milestones, and important events. This promotes honesty and trust.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRequestHistoryAccess(showHistoryModal)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Request Access
                </button>
                <button
                  onClick={() => setShowHistoryModal(null)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Confirm Breakup Modal */}
      {showConfirmBreakupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 animate-slide-up">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Confirm Breakup
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your partner has requested to end this relationship. By confirming, the relationship will be permanently ended.
              </p>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleConfirmBreakup(showConfirmBreakupModal)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Confirm Breakup
                </button>
                <button
                  onClick={() => setShowConfirmBreakupModal(null)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Relationships;