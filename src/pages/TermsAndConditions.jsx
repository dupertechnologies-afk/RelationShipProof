import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please read these terms carefully before using our service.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">1. Introduction</h2>
          <p>Welcome to [Your Website Name/App Name]. By accessing or using our service, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on [Your Website Name/App Name] for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on [Your Website Name/App Name];</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or “mirror” the materials on any other server.</li>
          </ul>
          <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by [Your Website Name/App Name] at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">3. Disclaimer</h2>
          <p>The materials on [Your Website Name/App Name] are provided on an ‘as is’ basis. [Your Website Name/App Name] makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          <p>Further, [Your Website Name/App Name] does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">4. Limitations</h2>
          <p>In no event shall [Your Website Name/App Name] or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on [Your Website Name/App Name], even if [Your Website Name/App Name] or a [Your Website Name/App Name] authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">5. Accuracy of Materials</h2>
          <p>The materials appearing on [Your Website Name/App Name] could include technical, typographical, or photographic errors. [Your Website Name/App Name] does not warrant that any of the materials on its website are accurate, complete or current. [Your Website Name/App Name] may make changes to the materials contained on its website at any time without notice. However [Your Website Name/App Name] does not make any commitment to update the materials.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">6. Links</h2>
          <p>[Your Website Name/App Name] has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by [Your Website Name/App Name] of the site. Use of any such linked website is at the user’s own risk.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">7. Modifications</h2>
          <p>[Your Website Name/App Name] may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">8. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">9. Contact Information</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at [email address].</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
