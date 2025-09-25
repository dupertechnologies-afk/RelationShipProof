import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle, XCircle, FileDown, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useCertificateStore from '../store/certificateStore'; // Assuming a certificate store will be created or used
import useAuthStore from '../store/authStore';

const RelationshipCertificateDisplay = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { getCertificate, downloadCertificate, shareCertificate, isLoading, error } = useCertificateStore();
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCertificate = async () => {
        const result = await getCertificate(id);
        if (result.success) {
          setCertificate(result.certificate);
        } else {
          toast.error(result.error || 'Failed to fetch certificate.');
        }
      };
      fetchCertificate();
    }
  }, [id, getCertificate]);

  const handleDownload = async () => {
    if (!certificate) return;
    const result = await downloadCertificate(certificate._id);
    if (result.success) {
      toast.success('Certificate download initiated!');
      // In a real app, you'd trigger a file download from result.downloadUrl
      console.log('Download URL:', result.downloadUrl);
    } else {
      toast.error(result.error || 'Failed to download certificate.');
    }
  };

  const handleShare = async () => {
    if (!certificate) return;
    const result = await shareCertificate(certificate._id, 'web'); // Example platform 'web'
    if (result.success) {
      toast.success('Certificate sharing link copied!');
      // In a real app, you'd copy to clipboard or open a share dialog
      console.log('Share URL:', result.shareUrl);
    } else {
      toast.error(result.error || 'Failed to share certificate.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error: {error}
          </h1>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certificate not found
          </h1>
          <Link
            to="/certificates"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      case 'ended': return <XCircle className="h-5 w-5 text-red-500 mr-2" />;
      default: return null;
    }
  };

  const relationship = certificate.relatedTo === 'relationship' ? certificate.relatedId : null;
  const initiator = relationship?.initiator; // Assuming relationship is populated
  const partner = relationship?.partner; // Assuming relationship is populated

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-custom-light dark:shadow-custom-dark overflow-hidden relative border-4 border-blue-500 dark:border-blue-400">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-700 dark:to-gray-900 opacity-75"></div>
        {certificate.design?.backgroundImage && (
          <img src={certificate.design.backgroundImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        )}

        <div className="relative p-8 sm:p-12 md:p-16 text-center z-10">
          <div className="flex justify-center mb-6">
            <Award className="h-20 w-20 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight font-serif">
            Certificate of Relationship
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 font-light italic">
            Awarded by RelationApp
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 sm:p-8 rounded-lg mb-10 border border-blue-200 dark:border-blue-700 shadow-sm">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              {certificate.title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {certificate.description}
            </p>
            {relationship && (
              <div className="mt-6">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Between:
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {initiator?.firstName} {initiator?.lastName} & {partner?.firstName} {partner?.lastName}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  {relationship.status && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusIcon(relationship.status) ? '' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {getStatusIcon(relationship.status)}
                      {relationship.status.charAt(0).toUpperCase() + relationship.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificate ID</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{certificate.metadata?.certificateNumber}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Issued</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Date(certificate.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FileDown className="h-5 w-5 mr-3" />
              Download Certificate
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Share2 className="h-5 w-5 mr-3" />
              Share Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipCertificateDisplay;
