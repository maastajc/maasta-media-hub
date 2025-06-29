
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import CreateAudition from "./pages/CreateAudition";
import EditAudition from "./pages/EditAudition";
import Dashboard from "./pages/Dashboard";
import AuditionApplications from "./pages/AuditionApplications";
import AuditionReview from "./pages/AuditionReview";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Networking from "./pages/Networking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

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
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              {/* Create audition route must come before the dynamic :id route */}
              <Route path="/auditions/create" element={<ProtectedRoute><CreateAudition /></ProtectedRoute>} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Public auth routes */}
              <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
              <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
              
              {/* Protected routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/networking" element={<ProtectedRoute><Networking /></ProtectedRoute>} />
              <Route path="/create-audition" element={<ProtectedRoute><CreateAudition /></ProtectedRoute>} />
              <Route path="/edit-audition/:id" element={<ProtectedRoute><EditAudition /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/applications/:auditionId" element={<ProtectedRoute><AuditionApplications /></ProtectedRoute>} />
              <Route path="/review/:auditionId" element={<ProtectedRoute><AuditionReview /></ProtectedRoute>} />
              
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
