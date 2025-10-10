import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Target, 
  Activity, 
  Award, 
  Bell,
  Plus,
  TrendingUp,
  Calendar,
  MessageCircle,
  Copy,
  Search,
  ChevronRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useRelationshipStore from '../store/relationshipStore';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { relationships, getRelationships, isLoading } = useRelationshipStore();
  const [stats, setStats] = useState({
    totalRelationships: 0,
    activeRelationships: 0,
    pendingInvites: 0,
    milestonesCompleted: 0,
    certificatesEarned: 0
  });

  useEffect(() => {
    getRelationships();
  }, []);

  useEffect(() => {
    if (relationships.length > 0) {
      const activeCount = relationships.filter(r => r.status === 'active').length;
      const pendingCount = relationships.filter(r => r.status === 'pending').length;
      
      setStats({
        totalRelationships: relationships.length,
        activeRelationships: activeCount,
        pendingInvites: pendingCount,
        milestonesCompleted: relationships.reduce((sum, r) => sum + (r.stats?.milestonesAchieved || 0), 0),
        certificatesEarned: 0 // Will be updated when certificates are implemented
      });
    }
  }, [relationships]);

  const recentRelationships = relationships
    .filter(r => r.status === 'active')
    .sort((a, b) => new Date(b.stats?.lastInteraction || b.createdAt) - new Date(a.stats?.lastInteraction || a.createdAt))
    .slice(0, 3);

  const pendingInvites = relationships.filter(r => 
    r.status === 'pending' && r.partner._id === user?.id
  );

  // const relationshipsWithHistoryStatus = relationships.map(r => ({
  //   ...r,
  //   historyAccessRequestedByPartner: r.historyAccess?.requested && r.historyAccess?.requestedBy?._id === (r.initiator._id === user?.id ? r.partner._id : r.initiator._id)
  // }));

  // const incomingHistoryRequests = relationshipsWithHistoryStatus.filter(r => 
  //   r.historyAccessRequestedByPartner && r.partner._id === user?.id
  // );

  const handleCopyRegistrationId = async () => {
    if (user?.registrationId) {
      try {
        await navigator.clipboard.writeText(user.registrationId);
        toast.success('Registration ID copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy Registration ID.');
        console.error('Failed to copy: ', err);
      }
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, link, subtitle }) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${color} shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {link && (
          <Link
            to={link}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
          </Link>
        )}
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, link, color, comingSoon }) => (
    <Link
      to={link}
      className={`block p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 group relative ${
        comingSoon ? 'opacity-60' : ''
      }`}
    >
      {comingSoon && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
            Soon
          </span>
        </div>
      )}
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 mt-16 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
                Here's what's happening in your relationships today.
              </p>
            </div>
            {user?.registrationId && (
              <div className="mt-4 lg:mt-0 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Your Registration ID
                  </p>
                  <p className="text-sm font-mono text-primary-600 dark:text-primary-400 truncate max-w-[200px]">
                    {user.registrationId}
                  </p>
                </div>
                <button
                  onClick={handleCopyRegistrationId}
                  className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  title="Copy Registration ID"
                >
                  <Copy className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mb-8 space-y-4">
          {/* Pending Invites Alert */}
          {pendingInvites.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    You have {pendingInvites.length} pending relationship invite{pendingInvites.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Review and respond to your pending invitations
                  </p>
                </div>
                <Link
                  to="/relationships"
                  className="ml-4 flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium text-sm flex items-center"
                >
                  Review <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          )}

          {/* Incoming History Access Requests Alert */}
          {/* {incomingHistoryRequests.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-base font-medium text-blue-800 dark:text-blue-200">
                    You have {incomingHistoryRequests.length} incoming history access request{incomingHistoryRequests.length > 1 ? 's' : ''}
                  </h3>
                  <div className="mt-2">
                    <Link
                      to="/relationships"
                      className="text-sm font-medium text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100 underline underline-offset-2 transition-colors duration-200"
                    >
                      Review requests →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2     gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Relationships"
            value={stats.totalRelationships}
            color="bg-blue-500"
            link="/relationships"
            subtitle="All connections"
          />
          <StatCard
            icon={Heart}
            title="Active"
            value={stats.activeRelationships}
            color="bg-green-500"
            link="/relationships"
            subtitle="Currently active"
          />
          {/* <StatCard
            icon={Target}
            title="Milestones"
            value={stats.milestonesCompleted}
            color="bg-purple-500"
            link="/milestones"
            subtitle="Achievements"
          />
          <StatCard
            icon={Activity}
            title="Activities"
            value="12"
            color="bg-orange-500"
            link="/activities"
            subtitle="This month"
          />
          <StatCard
            icon={Award}
            title="Certificates"
            value={stats.certificatesEarned}
            color="bg-amber-500"
            link="/certificates"
            subtitle="Earned"
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <Zap className="h-5 w-5 text-primary-500" />
            </div>
            <div className="space-y-3">
              <QuickAction
                icon={Plus}
                title="Invite Someone"
                description="Start a new relationship"
                link="/relationships/invite"
                color="bg-blue-500"
              />
              <QuickAction
                icon={Search}
                title="Find Someone"
                description="Search for existing users"
                link="/find-someone"
                color="bg-green-500"
              />
              <QuickAction
                icon={Target}
                title="Create Milestone"
                description="Set a new goal together"
                link="/milestones/create"
                color="bg-purple-500"
                comingSoon={true}
              />
              <QuickAction
                icon={Activity}
                title="Log Activity"
                description="Record a shared moment"
                link="/activities/create"
                color="bg-orange-500"
                comingSoon={true}
              />
              <QuickAction
                icon={MessageCircle}
                title="Create Agreement"
                description="Set mutual terms"
                link="/terms/create"
                color="bg-amber-500"
                comingSoon={true}
              />
            </div>
          </div>

          {/* Recent Relationships */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Relationships</h2>
                  <Link
                    to="/relationships"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                  >
                    View all <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {recentRelationships.length > 0 ? (
                  <div className="space-y-4">
                    {recentRelationships.map((relationship) => {
                      const partner = relationship.initiator._id === user?.id 
                        ? relationship.partner 
                        : relationship.initiator;
                      
                      return (
                        <div
                          key={relationship._id}
                          className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            {partner.avatar ? (
                              <img
                                src={partner.avatar}
                                alt={partner.fullName}
                                className="h-12 w-12 rounded-xl object-cover shadow-sm"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-medium text-lg">
                                  {partner.firstName?.[0]}{partner.lastName?.[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {relationship.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                with {partner.firstName} {partner.lastName}
                              </p>
                              <div className="flex items-center mt-2 space-x-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 capitalize">
                                  {relationship.type.replace('_', ' ')}
                                </span>
                                {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Trust: {relationship.stats?.trustLevel || 50}%
                                </span> */}
                              </div>
                            </div>
                          </div>
                          {/* <Link
                            to={`/relationships/${relationship._id}`}
                            className="opacity-0 group-hover:opacity-100 flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-300"
                          >
                            View <ChevronRight className="h-4 w-4 ml-1" />
                          </Link> */}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No relationships yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                      Start building meaningful connections by inviting someone special.
                    </p>
                    <Link
                      to="/relationships/invite"
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Someone
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        {/* <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recent activity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start logging activities with your relationships to see them here.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;