import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  Download, 
  Share2, 
  Calendar,
  Users,
  Trophy,
  Medal,
  Star,
  Eye,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import useCertificateStore from '../store/certificateStore';

const CertificateDetail = () => {
  const { id } = useParams();
  const { certificate, getCertificate, downloadCertificate, shareCertificate, isLoading } = useCertificateStore();

  useEffect(() => {
    if (id) {
      getCertificate(id);
    }
  }, [id, getCertificate]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      case 'diamond': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'bronze': return <Medal className="h-8 w-8" />;
      case 'silver': return <Medal className="h-8 w-8" />;
      case 'gold': return <Trophy className="h-8 w-8" />;
      case 'platinum': return <Award className="h-8 w-8" />;
      case 'diamond': return <Star className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  const handleDownload = async () => {
    const result = await downloadCertificate(id);
    if (result.success) {
      toast.success('Certificate downloaded successfully!');
    } else {
      toast.error(result.error);
    }
  };

  const handleShare = async (platform) => {
    const result = await shareCertificate(id, platform);
    if (result.success) {
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=I just earned a ${certificate.title} certificate!&url=${window.location.href}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
      };

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Certificate link copied to clipboard!');
      }

      toast.success(`Certificate shared on ${platform}!`);
    } else {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certificate not found
          </h1>
          <Link
            to="/certificates"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to certificates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/certificates"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to certificates
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Display */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Certificate Header */}
              <div className={`h-40 bg-gradient-to-r ${getLevelColor(certificate.level)} flex items-center justify-center relative`}>
                <div className="text-white text-center">
                  {getLevelIcon(certificate.level)}
                  <div className="text-3xl font-bold mt-2">
                    {certificate.level.toUpperCase()}
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-white text-base">
                  #{certificate.metadata.certificateNumber}
                </div>
              </div>

              {/* Certificate Content */}
              <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Certificate of Achievement
                </h1>
                
                <div className="mb-6">
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                    This certifies that
                  </p>
                  <div className="flex justify-center space-x-4 mb-4">
                    {certificate.recipients.map((recipient, index) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                          {recipient.user.avatar ? (
                            <img src={recipient.user.avatar} alt={recipient.user.firstName} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white text-2xl font-medium">
                              {recipient.user.firstName[0]}{recipient.user.lastName?.[0] || ''}
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {recipient.user.firstName} {recipient.user.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                    {certificate.recipients.length > 1 ? 'have' : 'has'} successfully completed
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {certificate.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-base">
                    {certificate.description}
                  </p>
                </div>

                {certificate.relatedTo === 'milestone' && certificate.relatedId && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Related Milestone:
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {certificate.relatedId.title}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between items-center text-base text-gray-500 dark:text-gray-400">
                    <div>
                      <p>Issued by {certificate.metadata.issuedBy}</p>
                      <p>Date: {new Date(certificate.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p>Certificate #{certificate.metadata.certificateNumber}</p>
                      {certificate.metadata.validUntil && (
                        <p>Valid until: {new Date(certificate.metadata.validUntil).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in">
            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Certificate
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5 mr-1" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <ExternalLink className="h-5 w-5 mr-1" />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <span className="text-base text-gray-600 dark:text-gray-400">Views</span>
                  </div>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {certificate.stats.viewCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-gray-400" />
                    <span className="text-base text-gray-600 dark:text-gray-400">Downloads</span>
                  </div>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {certificate.stats.downloadCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-gray-400" />
                    <span className="text-base text-gray-600 dark:text-gray-400">Shares</span>
                  </div>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {certificate.stats.shareCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Criteria */}
            {certificate.criteria && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Achievement Criteria
                </h3>
                <div className="space-y-3">
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    {certificate.criteria.description}
                  </p>
                  
                  {certificate.criteria.requirements && (
                    <div>
                      <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        Requirements:
                      </p>
                      <ul className="space-y-1">
                        {certificate.criteria.requirements.map((requirement, index) => (
                          <li key={index} className="text-base text-gray-600 dark:text-gray-400 flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {certificate.criteria.timeRequired && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Time Required</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {certificate.criteria.timeRequired} days
                        </p>
                      </div>
                    )}
                    
                    {certificate.criteria.pointsRequired && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Points Required</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {certificate.criteria.pointsRequired}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {certificate.relatedTo === 'relationship' && certificate.relatedId && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-custom-light dark:shadow-custom-dark border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Relationship
                </h3>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-base">
                      {certificate.relatedId.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      with {certificate.relatedId.partner.firstName} {certificate.relatedId.partner.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;