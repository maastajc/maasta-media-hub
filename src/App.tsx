
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LayoutWithNavigation } from "@/components/layout/LayoutWithNavigation";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import MyEvents from "./pages/MyEvents";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import CreateAudition from "./pages/CreateAudition";
import EditAudition from "./pages/EditAudition";
import MyAuditions from "./pages/MyAuditions";
import MyApplications from "./pages/MyApplications";
import MyOrganizations from "./pages/MyOrganizations";
import MyReview from "./pages/MyReview";
import AuditionApplications from "./pages/AuditionApplications";
import AuditionReview from "./pages/AuditionReview";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import CompleteProfile from "./pages/CompleteProfile";
import BasicInformation from "./pages/BasicInformation";
import Networking from "./pages/Networking";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaymentSuccess from "./pages/PaymentSuccess";

// Import auth components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <LayoutWithNavigation>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistProfile />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/auditions" element={<Auditions />} />
                <Route path="/auditions/:id" element={<AuditionDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Auth Routes */}
                <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
                <Route path="/basic-information" element={<ProtectedRoute><BasicInformation /></ProtectedRoute>} />
                <Route path="/networking" element={<ProtectedRoute><Networking /></ProtectedRoute>} />

                {/* My Pages - Profile Related */}
                <Route path="/my-auditions" element={<ProtectedRoute><MyAuditions /></ProtectedRoute>} />
                <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
                <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
                <Route path="/my-organizations" element={<ProtectedRoute><MyOrganizations /></ProtectedRoute>} />
                <Route path="/my-review" element={<ProtectedRoute><MyReview /></ProtectedRoute>} />

                {/* Content Management Routes */}
                <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                <Route path="/events/:id/edit" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
                <Route path="/auditions/create" element={<ProtectedRoute><CreateAudition /></ProtectedRoute>} />
                <Route path="/auditions/:id/edit" element={<ProtectedRoute><EditAudition /></ProtectedRoute>} />
                <Route path="/auditions/:id/applications" element={<ProtectedRoute><AuditionApplications /></ProtectedRoute>} />
                <Route path="/auditions/:auditionId/applications/:applicationId/review" element={<ProtectedRoute><AuditionReview /></ProtectedRoute>} />

                {/* Payment Routes */}
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LayoutWithNavigation>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
