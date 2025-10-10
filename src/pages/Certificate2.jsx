import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import useRelationshipStore from '../store/relationshipStore';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const Certificate2 = () => {
  const { user } = useAuthStore();
  const { relationships, getRelationships, isLoading: relationshipsLoading } = useRelationshipStore();
  const [selectedRelationshipId, setSelectedRelationshipId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRelationships();
  }, []);

  // Fetch existing certificate if available for selected relationship
  useEffect(() => {
    const fetchExistingCertificate = async () => {
      if (selectedRelationshipId) {
        const selectedRel = activeRelationships.find(rel => rel._id === selectedRelationshipId);
        if (selectedRel?.latestCertificate) {
          setCertificateLoading(true);
          setError(null);
          try {
            const response = await api.get(`/certificates/${selectedRel.latestCertificate._id}/download`, {
              responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            setCertificateData(URL.createObjectURL(blob));
            toast.info('Existing certificate loaded.');
          } catch (err) {
            console.error('Error fetching existing certificate:', err);
            setError(err.response?.data?.message || 'Failed to fetch existing certificate.');
            toast.error(error);
          } finally {
            setCertificateLoading(false);
          }
        } else {
          setCertificateData(null);
        }
      }
    };
    fetchExistingCertificate();
  }, [selectedRelationshipId, relationships]); // Depend on selectedRelationshipId and relationships

  const handleRelationshipChange = (e) => {
    setSelectedRelationshipId(e.target.value);
    setCertificateData(null); // Clear previous certificate when relationship changes
    setError(null);
  };

  const generateCertificate = async () => {
    if (!selectedRelationshipId) {
      toast.error('Please select a relationship first.');
      return;
    }

    // Check if a certificate already exists for this relationship
    const selectedRel = activeRelationships.find(rel => rel._id === selectedRelationshipId);
    if (selectedRel?.latestCertificate) {
      toast.info('A certificate already exists for this relationship. Loading existing certificate.');
      // Directly load the existing certificate instead of generating a new one
      // The useEffect above will handle fetching and displaying it
      return;
    }

    setCertificateLoading(true);
    setCertificateData(null);
    setError(null);

    try {
      const response = await api.get(`/certificates/generate/${selectedRelationshipId}`, {
        responseType: 'blob' // Important for downloading files
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      setCertificateData(URL.createObjectURL(blob));
      toast.success('Certificate generated successfully!');
      // Optionally re-fetch relationships to update latestCertificate ID in store
      getRelationships(); 
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError(err.response?.data?.message || 'Failed to generate certificate.');
      toast.error(error);
    } finally {
      setCertificateLoading(false);
    }
  };

  const downloadCertificate = () => {
    if (certificateData) {
      const link = document.createElement('a');
      link.href = certificateData;
      link.setAttribute('download', 'certificate.pdf'); // You might want to get the filename from the backend
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const activeRelationships = relationships.filter(rel => rel.status === 'active');

  if (relationshipsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/dashboard"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Award className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Generate Relationship Certificate
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Select a relationship to generate a beautiful certificate of your journey together.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Relationship Selection */}
          <div>
            <label htmlFor="relationshipSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Relationship
            </label>
            <select
              id="relationshipSelect"
              name="relationshipSelect"
              value={selectedRelationshipId}
              onChange={handleRelationshipChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Select an active relationship --</option>
              {activeRelationships.map(relationship => (
                <option key={relationship._id} value={relationship._id}>
                  {relationship.title} with {relationship.initiator._id === user?.id ? relationship.partner.fullName : relationship.initiator.fullName}
                </option>
              ))}
            </select>
            {activeRelationships.length === 0 && (
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                You don't have any active relationships to generate certificates for. <Link to="/relationships/invite" className="text-indigo-600 hover:text-indigo-500">Invite someone now!</Link>
              </p>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={generateCertificate}
              disabled={!selectedRelationshipId || certificateLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {certificateLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                <>
                  <Award className="h-5 w-5 mr-2" />
                  Generate Certificate
                </>
              )}
            </button>
          </div>

          {/* Certificate Display */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-300">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {certificateData && (
            <div className="mt-8 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white p-4 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-700">
                Your Certificate
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Click the button below to download your certificate or view it in a new tab.</p>
                <div className="flex justify-center mb-4">
                  <a
                    href={certificateData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Award className="h-5 w-5 mr-2" />
                    View Certificate (New Tab)
                  </a>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={downloadCertificate}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate2;
