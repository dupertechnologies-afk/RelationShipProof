import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, ChevronDown, Award, Calendar, Heart, User } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import useRelationshipStore from '../store/relationshipStore';

const RelationshipSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    relationships,
    currentRelationship,
    getRelationship,
    setCurrentRelationship,
    isLoading,
    requestTypeChange,
    acceptTypeChange,
    declineTypeChange,
    cancelTypeChange,
    generateRelationshipCertificate
  } = useRelationshipStore();

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [typeChangeMessage, setTypeChangeMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const existing = relationships.find(r => r._id === id);
    if (!existing) {
      getRelationship(id);
    } else {
      setCurrentRelationship(existing);
    }
  }, [id, relationships, getRelationship, setCurrentRelationship]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  const relationship = currentRelationship || relationships.find(r => r._id === id);
  if (!relationship) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Relationship not found</h1>
          <Link to="/relationships" className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300">← Back to relationships</Link>
        </div>
      </div>
    );
  }

  const relationshipTypes = [
    'acquaintance', 'friend', 'close_friend', 'best_friend', 'romantic_interest', 'partner', 'engaged', 'married', 'family', 'mentor', 'mentee'
  ];

  const partner = relationship.initiator?._id === user?.id ? relationship.partner : relationship.initiator;
  const pendingTypeRequest = relationship.typeChangeRequest?.requested ? relationship.typeChangeRequest : null;
  const iRequestedTypeChange = pendingTypeRequest && pendingTypeRequest.requestedBy === user?.id;

  const handleSendTypeChange = async () => {
    if (!selectedType || selectedType === relationship.type) {
      toast.error('Please select a different relationship type');
      return;
    }
    const res = await requestTypeChange(relationship._id, { newType: selectedType, message: typeChangeMessage || undefined });
    if (res.success) {
      toast.success('Type change request sent');
      setShowTypeDropdown(false);
      setTypeChangeMessage('');
    } else {
      toast.error(res.error);
    }
  };

  const handleGenerateCertificate = async () => {
    const result = await generateRelationshipCertificate(relationship._id);
    if (result.success) {
      toast.success('Relationship certificate generated successfully!');
      navigate(`/certificates/${result.certificate._id}/display`);
    } else {
      toast.error(result.error || 'Failed to generate certificate.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 mt-16 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link to="/relationships" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to relationships
          </Link>
        </div>

        {/* Header card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              {partner?.avatar ? (
                <img src={partner.avatar} alt={partner.fullName || 'Partner'} className="h-16 w-16 rounded-xl object-cover shadow" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow">
                  <span className="text-white text-xl font-semibold">{partner?.firstName?.[0] || ''}{partner?.lastName?.[0] || ''}</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {relationship.title || 'Untitled Relationship'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base">
                  with {partner?.firstName || 'N/A'} {partner?.lastName || ''}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${relationship.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : relationship.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>{relationship.status}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {relationship.type?.replace('_',' ')}
                  </span>
                  {relationship.typeChangeRequest?.requested && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Type change pending</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to={`/relationships/${relationship._id}/settings`} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Link>
              {relationship.status === 'active' && (
                <div className="relative">
                  <button onClick={() => setShowTypeDropdown(v => !v)} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <ChevronDown className="h-4 w-4 mr-2" /> Change Type
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-4 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select new type</label>
                        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 mb-3">
                          <option value="">Choose...</option>
                          {relationshipTypes.map(t => (
                            <option key={t} value={t}>{t.replace('_',' ')}</option>
                          ))}
                        </select>
                        <textarea value={typeChangeMessage} onChange={e => setTypeChangeMessage(e.target.value)} rows={3} placeholder="Optional message" className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2 mb-3" />
                        <div className="flex space-x-2">
                          <button onClick={handleSendTypeChange} className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Send Request</button>
                          <button onClick={() => { setShowTypeDropdown(false); setTypeChangeMessage(''); }} className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-1 md:col-span-2 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary-500" /> Basic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Title</p>
                <p className="font-medium text-gray-900 dark:text-white">{relationship.title || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{relationship.type?.replace('_',' ')}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white">{relationship.status}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Privacy</p>
                <p className="font-medium text-gray-900 dark:text-white">{relationship.privacy}</p>
              </div>
            </div>
            {relationship.description && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{relationship.description}</p>
              </div>
            )}
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-rose-500" /> Highlights
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Trust</span><span className="font-medium text-gray-900 dark:text-white">{relationship.stats?.trustLevel ?? 50}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Activities</span><span className="font-medium text-gray-900 dark:text-white">{relationship.stats?.totalActivities ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Milestones</span><span className="font-medium text-gray-900 dark:text-white">{relationship.stats?.milestonesAchieved ?? 0}</span></div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-emerald-500" /> Timeline
          </h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-5">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Relationship started</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(relationship.startDate).toLocaleDateString()}</p>
              </div>
              {relationship.acceptedDate && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Accepted</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(relationship.acceptedDate).toLocaleDateString()}</p>
                </div>
              )}
              {relationship.stats?.lastInteraction && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Last interaction</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(relationship.stats.lastInteraction).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Type change banner */}
        {pendingTypeRequest && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start justify-between">
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
                <button onClick={async () => { const res = await cancelTypeChange(relationship._id); if (res.success) toast.success('Request canceled'); else toast.error(res.error); }} className="px-3 py-1.5 rounded-md text-sm border border-blue-300 text-blue-700 dark:text-blue-300 bg-white dark:bg-transparent hover:bg-blue-100">Cancel Request</button>
              ) : (
                <>
                  <button onClick={async () => { const res = await acceptTypeChange(relationship._id); if (res.success) toast.success('Type changed'); else toast.error(res.error); }} className="px-3 py-1.5 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700">Accept</button>
                  <button onClick={async () => { const res = await declineTypeChange(relationship._id); if (res.success) toast.success('Request declined'); else toast.error(res.error); }} className="px-3 py-1.5 rounded-md text-sm border border-blue-300 text-blue-700 dark:text-blue-300 bg-white dark:bg-transparent hover:bg-blue-100">Decline</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Certificate section */}
        <div className="mt-6 flex justify-end">
          {relationship.latestCertificate ? (
            <Link to={`/certificates/${relationship.latestCertificate._id}/display`} className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Award className="h-4 w-4 mr-2" /> View Relationship Certificate
            </Link>
          ) : (
            relationship.status === 'active' && (
              <button onClick={handleGenerateCertificate} className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Award className="h-4 w-4 mr-2" /> Generate Relationship Certificate
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipSummary;


