
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import CreateAudition from "./pages/CreateAudition";
import EditAudition from "./pages/EditAudition";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AuditionApplications from "./pages/AuditionApplications";
import AuditionReview from "./pages/AuditionReview";
import Networking from "./pages/Networking";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:username" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/auditions/:auditionNumber" element={<AuditionDetails />} />
              <Route path="/networking" element={<Networking />} />
              
              {/* Auth routes - only accessible when not authenticated */}
              <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
              <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-audition" element={<ProtectedRoute><CreateAudition /></ProtectedRoute>} />
              <Route path="/edit-audition/:id" element={<ProtectedRoute><EditAudition /></ProtectedRoute>} />
              <Route path="/auditions/:auditionNumber/applications" element={<ProtectedRoute><AuditionApplications /></ProtectedRoute>} />
              <Route path="/auditions/:auditionNumber/review/:applicationId" element={<ProtectedRoute><AuditionReview /></ProtectedRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
