
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import Events from "./pages/Events";
import Artists from "./pages/Artists";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import CreateAudition from "./pages/CreateAudition";
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:artistId" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/auditions/create" element={<CreateAudition />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
