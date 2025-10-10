import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Search, 
  Filter, 
  Download,
  Share2,
  Trophy,
  Medal,
  Star,
  Calendar,
  Users
} from 'lucide-react';
import useCertificateStore from '../store/certificateStore';

const Certificates = () => {
  const { certificates, fetchAllCertificates, downloadCertificate, shareCertificate, isLoading } = useCertificateStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    fetchAllCertificates();
  }, [fetchAllCertificates]);

  const handleDownload = async (id) => {
    const result = await downloadCertificate(id);
    if (result.success) {
      toast.success('Certificate downloaded successfully!');
    } else {
      toast.error(result.error);
    }
  };

  const handleShare = async (id, platform) => {
    const result = await shareCertificate(id, platform);
    if (result.success) {
      toast.success(`Certificate shared on ${platform}!`);
    } else {
      toast.error(result.error);
    }
  };

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = !searchTerm || 
      certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || certificate.type === typeFilter;
    const matchesLevel = levelFilter === 'all' || certificate.level === levelFilter;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'diamond': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'bronze': return <Medal className="h-4 w-4" />;
      case 'silver': return <Medal className="h-4 w-4" />;
      case 'gold': return <Trophy className="h-4 w-4" />;
      case 'platinum': return <Award className="h-4 w-4" />;
      case 'diamond': return <Star className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'milestone': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'anniversary': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'achievement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trust': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'communication': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Certificates
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
            Celebrate your relationship achievements and milestones
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certificates.length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certificates.filter(c => c.level === 'gold' || c.level === 'platinum' || c.level === 'diamond').length}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Level</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certificates.reduce((sum, c) => sum + c.stats.downloadCount, 0)}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Share2 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certificates.reduce((sum, c) => sum + c.stats.shareCount, 0)}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shares</p>
              </div>
            </div>
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
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            >
              <option value="all">All Types</option>
              <option value="milestone">Milestone</option>
              <option value="anniversary">Anniversary</option>
              <option value="achievement">Achievement</option>
              <option value="trust">Trust</option>
              <option value="communication">Communication</option>
              <option value="commitment">Commitment</option>
              <option value="growth">Growth</option>
              <option value="special">Special</option>
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 transition-colors duration-200"
            >
              <option value="all">All Levels</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Certificate Header with Gradient */}
                <div className={`h-24 bg-gradient-to-r ${
                  certificate.level === 'diamond' ? 'from-blue-400 to-blue-600' :
                  certificate.level === 'platinum' ? 'from-purple-400 to-purple-600' :
                  certificate.level === 'gold' ? 'from-yellow-400 to-yellow-600' :
                  certificate.level === 'silver' ? 'from-gray-400 to-gray-600' :
                  'from-orange-400 to-orange-600'
                } flex items-center justify-center`}>
                  <div className="text-white text-center">
                    {getLevelIcon(certificate.level)}
                    <div className="text-2xl font-bold mt-1">
                      {certificate.level.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Title and Badges */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {certificate.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(certificate.type)}`}>
                        {certificate.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(certificate.level)}`}>
                        {getLevelIcon(certificate.level)}
                        <span className="ml-1">{certificate.level}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-base">
                      {certificate.relatedTo === 'relationship' && certificate.relatedId && (
                        <p className="text-base text-gray-600 dark:text-gray-400">
                          {certificate.relatedId.title} with {certificate.relatedId.partner.firstName} {certificate.relatedId.partner.lastName}
                        </p>
                      )}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
                    {certificate.description}
                  </p>

                  {/* Related Entity Info */}
                  {certificate.relatedTo === 'milestone' && certificate.relatedId && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Related Milestone:
                      </p>
                      <p className="text-base text-gray-600 dark:text-gray-400">
                        {certificate.relatedId.title}
                      </p>
                    </div>
                  )}

                  {/* Recipients */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recipients
                      </span>
                    </div>
                    <div className="flex -space-x-2">
                      {certificate.recipients.map((recipient, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800"
                          title={`${recipient.user.firstName} - Awarded ${new Date(recipient.awardedAt).toLocaleDateString()}`}
                        >
                          {recipient.user.avatar ? (
                            <img src={recipient.user.avatar} alt={recipient.user.firstName} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <span>{recipient.user.firstName[0]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificate Number and Date */}
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>Certificate #{certificate.metadata.certificateNumber}</div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Issued {new Date(certificate.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{certificate.stats.viewCount} views</span>
                    <span>{certificate.stats.downloadCount} downloads</span>
                    <span>{certificate.stats.shareCount} shares</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/certificates/${certificate._id}/display`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => handleDownload(certificate._id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleShare(certificate._id, 'twitter')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || typeFilter !== 'all' || levelFilter !== 'all' 
                ? 'No certificates match your filters' 
                : 'No certificates yet'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
              {searchTerm || typeFilter !== 'all' || levelFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Complete milestones and activities to earn certificates celebrating your relationship achievements.'
              }
            </p>
            {(!searchTerm && typeFilter === 'all' && levelFilter === 'all') && (
              <Link
                to="/milestones"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Milestones
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;