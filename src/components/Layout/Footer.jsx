import { Heart, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-custom-light dark:shadow-custom-dark border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                RelationshipApp
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md text-sm leading-relaxed">
              Building meaningful connections through transparency, mutual agreements,
              and celebrating the journey of relationships.
            </p>
            {/* <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          {/* Features */}
          {/* <div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Relationship Tracking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Terms & Agreements
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Milestones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Certificates
                </a>
              </li>
            </ul>
          </div> */}

          {/* Support */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} RelationshipApp. Made with{' '}
            <Heart className="inline h-4 w-4 text-red-500" />{' '}
            for meaningful connections.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;