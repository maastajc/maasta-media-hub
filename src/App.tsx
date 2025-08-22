import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { PublicRoute } from "./components/routes/PublicRoute";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { LayoutWithNavigation } from "./components/layout/LayoutWithNavigation";
import { ScrollToTop } from "./components/utils/ScrollToTop";

// Public Pages
import Index from "./pages/Index";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Auth Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Protected Pages
import BasicInformation from "./pages/BasicInformation";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyAuditions from "./pages/MyAuditions";
import MyEvents from "./pages/MyEvents";
import MyOrganizations from "./pages/MyOrganizations";
import MyApplications from "./pages/MyApplications";
import MyReview from "./pages/MyReview";
import Networking from "./pages/Networking";
import CreateAudition from "./pages/CreateAudition";
import CreateEvent from "./pages/CreateEvent";
import EditAudition from "./pages/EditAudition";
import EditEvent from "./pages/EditEvent";
import AuditionReview from "./pages/AuditionReview";
import AuditionApplications from "./pages/AuditionApplications";
import PaymentSuccess from "./pages/PaymentSuccess";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationProfile from "./pages/OrganizationProfile";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LayoutWithNavigation>
                    <Index />
                  </LayoutWithNavigation>
                </PublicRoute>
              }
            />
            <Route
              path="/auditions"
              element={
                <LayoutWithNavigation>
                  <Auditions />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/auditions/:id"
              element={
                <LayoutWithNavigation>
                  <AuditionDetails />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/events"
              element={
                <LayoutWithNavigation>
                  <Events />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/events/:id"
              element={
                <LayoutWithNavigation>
                  <EventDetails />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/artists"
              element={
                <LayoutWithNavigation>
                  <Artists />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/artists/:id"
              element={
                <LayoutWithNavigation>
                  <ArtistProfile />
                </LayoutWithNavigation>
              }
            />
            
            {/* Organization Profile - Public */}
            <Route
              path="/organizations/:id"
              element={
                <LayoutWithNavigation>
                  <OrganizationProfile />
                </LayoutWithNavigation>
              }
            />

            {/* Auth Routes */}
            <Route
              path="/sign-in"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <BasicInformation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <Profile />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <Dashboard />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-auditions"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <MyAuditions />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <MyEvents />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-organizations"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <MyOrganizations />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/create"
              element={
                <ProtectedRoute>
                  <CreateOrganization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <MyApplications />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-review"
              element={
                <ProtectedRoute>
                  <ProfileLayout>
                    <MyReview />
                  </ProfileLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/networking"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <Networking />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-audition"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <CreateAudition />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <CreateEvent />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-audition/:id"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <EditAudition />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-event/:id"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <EditEvent />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audition-review/:id"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <AuditionReview />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audition-applications/:id"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <AuditionApplications />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <LayoutWithNavigation>
                    <PaymentSuccess />
                  </LayoutWithNavigation>
                </ProtectedRoute>
              }
            />

            {/* Static Pages */}
            <Route
              path="/about"
              element={
                <LayoutWithNavigation>
                  <About />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/contact"
              element={
                <LayoutWithNavigation>
                  <Contact />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/privacy"
              element={
                <LayoutWithNavigation>
                  <Privacy />
                </LayoutWithNavigation>
              }
            />
            <Route
              path="/terms"
              element={
                <LayoutWithNavigation>
                  <Terms />
                </LayoutWithNavigation>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
