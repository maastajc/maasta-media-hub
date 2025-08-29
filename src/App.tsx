import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

import Home from './pages/Home';
import Artists from './pages/Artists';
import Auditions from './pages/Auditions';
import Events from './pages/Events';
import Networking from './pages/Networking';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CompleteProfile from './pages/CompleteProfile';
import CreateAudition from './pages/CreateAudition';
import CreateEvent from './pages/CreateEvent';
import MyAuditions from './pages/MyAuditions';
import MyEvents from './pages/MyEvents';
import MyApplications from './pages/MyApplications';
import MyOrganizations from './pages/MyOrganizations';
import ReviewApplications from './pages/ReviewApplications';
import AuditionDetails from './pages/AuditionDetails';
import EventDetails from './pages/EventDetails';
import OrganizationDetails from './pages/OrganizationDetails';
import Applications from './pages/Applications';
import Review from './pages/Review';
import ScrollToTop from './utils/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { LayoutWithNavigation } from './components/layout/LayoutWithNavigation';
import Notifications from "@/pages/Notifications";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('currentUser');
  return user ? children : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <LayoutWithNavigation>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/auditions" element={<Auditions />} />
                <Route path="/auditions/:id" element={<AuditionDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/networking" element={<Networking />} />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/:id" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />}
                  </ProtectedRoute>
                } />
                <Route path="/my-auditions" element={
                  <ProtectedRoute>
                    <MyAuditions />
                  </ProtectedRoute>
                } />
                <Route path="/my-events" element={
                  <ProtectedRoute>
                    <MyEvents />
                  </ProtectedRoute>
                } />
                <Route path="/my-applications" element={
                  <ProtectedRoute>
                    <MyApplications />
                  </ProtectedRoute>
                } />
                <Route path="/my-organizations" element={
                  <ProtectedRoute>
                    <MyOrganizations />
                  </ProtectedRoute>
                } />
                <Route path="/my-review" element={
                  <ProtectedRoute>
                    <ReviewApplications />
                  </ProtectedRoute>
                } />
                <Route path="/applications/:id" element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="/review/:id" element={
                  <ProtectedRoute>
                    <Review />
                  </ProtectedRoute>
                } />
                
                <Route path="/organizations/:id" element={<OrganizationDetails />} />
                
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/complete-profile" element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                } />
                <Route path="/auditions/create" element={
                  <ProtectedRoute>
                    <CreateAudition />
                  </ProtectedRoute>
                } />
                <Route path="/events/create" element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } />
                
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </LayoutWithNavigation>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
