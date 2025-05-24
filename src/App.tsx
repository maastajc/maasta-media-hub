import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import CreateAudition from "./pages/CreateAudition";
import EditAudition from "@/pages/EditAudition";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:artistId" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/events/create" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/auditions/create" element={
                <ProtectedRoute>
                  <CreateAudition />
                </ProtectedRoute>
              } />
              
              <Route path="/auditions/edit/:auditionId" element={<EditAudition />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
