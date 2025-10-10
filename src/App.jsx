import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Relationships from './pages/Relationships';
import RelationshipDetail from './pages/RelationshipDetail';
import InviteRelationship from './pages/InviteRelationship';
import Terms from './pages/Terms';
import Milestones from './pages/Milestones';
import Activities from './pages/Activities';
import Certificates from './pages/Certificates';
import CertificateDetail from './pages/CertificateDetail';
import Certificate2 from './pages/Certificate2'; // New import for Certificate2
import CreateMilestone from './pages/CreateMilestone';
import CreateActivity from './pages/CreateActivity';
import CreateTerm from './pages/CreateTerm';
import MilestoneDetail from './pages/MilestoneDetail';
import ActivityDetail from './pages/ActivityDetail';
import TermDetail from './pages/TermDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import RelationshipCertificateDisplay from './pages/RelationshipCertificateDisplay';
import FindSomeone from './pages/FindSomeone'; // Import the new FindSomeone component
import PrivacyPolicy from './pages/PrivacyPolicy'; // New import
import TermsAndConditions from './pages/TermsAndConditions'; // New import
import ContactUs from './pages/ContactUs'; // New import

// Stores
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';
import RelationshipSettings from './pages/RelationshipSettings';
// import History from './pages/History'; // Correctly import the new History component
import Counter from './practice/Counter';
import EventHandling from './practice/EventHndling';
import Condentional from './practice/Condentional';
import ListRendering from './practice/ListRendering';
import FormHandling from './practice/FormHandling';
import Parent from "./practice/ChilttoParent"; 
import Apin from './practice/CommentSection';
import Optimize from './practice/Optimize';

function App() {
  const { isAuthenticated, getMe } = useAuthStore();
  const { setInitialTheme, theme } = useThemeStore();

  useEffect(() => {
    // Apply theme on app load
    setInitialTheme();
    // Get user data if token exists
    if (isAuthenticated()) {
      getMe();
    }
  }, [isAuthenticated, getMe, setInitialTheme]);

  return (
    // <Optimize/>
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/signup" 
              element={!isAuthenticated() ? <Signup /> : <Navigate to="/dashboard" replace />} 
            />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/relationships" element={
              <ProtectedRoute>
                <Relationships />
              </ProtectedRoute>
            } />
            
            <Route path="/relationships/invite" element={
              <ProtectedRoute>
                <InviteRelationship />
              </ProtectedRoute>
            } />
            
            <Route path="/relationships/:id" element={
              <ProtectedRoute>
                <RelationshipDetail />
              </ProtectedRoute>
            } />
          
            
            <Route path="/relationships/:id/settings" element={
              <ProtectedRoute>
                <RelationshipSettings />
              </ProtectedRoute>
            } />
            
            {/* <Route path="/history/:userId" element={ */}
            {/*   <ProtectedRoute> */}
            {/*     <History /> */}
            {/*   </ProtectedRoute> */}
            {/* } /> */}
            
            {/* <Route path="/history-search" element={  */}
            {/*   <ProtectedRoute> */}
            {/*     <History /> */}
            {/*   </ProtectedRoute> */}
            {/* } /> */}

            <Route path="/terms" element={
              <ProtectedRoute>
                <Terms />
              </ProtectedRoute>
            } />
            
            <Route path="/terms/create" element={
              <ProtectedRoute>
                <CreateTerm />
              </ProtectedRoute>
            } />
            
            <Route path="/terms/:id" element={
              <ProtectedRoute>
                <TermDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/milestones" element={
              <ProtectedRoute>
                <Milestones />
              </ProtectedRoute>
            } />
            
            <Route path="/milestones/create" element={
              <ProtectedRoute>
                <CreateMilestone />
              </ProtectedRoute>
            } />
            
            <Route path="/milestones/:id" element={
              <ProtectedRoute>
                <MilestoneDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/activities" element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            } />
            
            <Route path="/activities/create" element={
              <ProtectedRoute>
                <CreateActivity />
              </ProtectedRoute>
            } />
            
            <Route path="/activities/:id" element={
              <ProtectedRoute>
                <ActivityDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/certificates" element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } />
            
            <Route path="/certificates/:id" element={
              <ProtectedRoute>
                <CertificateDetail />
              </ProtectedRoute>
            } />
            
            {/* New Certificate2 Route */}
            <Route path="/certificate2" element={
              <ProtectedRoute>
                <Certificate2 />
              </ProtectedRoute>
            } />
            
            <Route path="/certificates/:id/display" element={
              <ProtectedRoute>
                <RelationshipCertificateDisplay />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/find-someone" element={
              <ProtectedRoute>
                <FindSomeone />
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route 
              path="/privacy-policy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms-and-conditions" 
              element={<TermsAndConditions />} 
            />
            <Route 
              path="/contact-us" 
              element={<ContactUs />} 
            />
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
              } 
            />
            
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
                  <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </div>
    </Router>
  );
}

export default App;