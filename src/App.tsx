
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import ScrollToTop from "@/components/layout/ScrollToTop";
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
import AuditionApplications from "./pages/AuditionApplications";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artists" element={<Artists />} />
              {/* Support both singular and plural routes for artist profiles */}
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/artists/:id" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              {/* Support both singular and plural routes for audition details */}
              <Route path="/audition/:id" element={<AuditionDetails />} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
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
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auditions/create" 
                element={
                  <ProtectedRoute>
                    <CreateAudition />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auditions/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditAudition />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auditions/:id/applications" 
                element={
                  <ProtectedRoute>
                    <AuditionApplications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
