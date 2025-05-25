
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import Events from "./pages/Events";

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
              <Route path="/profile" element={<Profile />} />
              <Route path="/artists/:artistId" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
