
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CompleteProfile from "./pages/CompleteProfile";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Auditions from "./pages/Auditions";
import AuditionDetails from "./pages/AuditionDetails";
import CreateAudition from "./pages/CreateAudition";
import Dashboard from "./pages/Dashboard";
import Networking from "./pages/Networking";
import ScrollToTop from "./components/layout/ScrollToTop";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/auditions/create" element={<CreateAudition />} />
              <Route path="/auditions/:id" element={<AuditionDetails />} />
              <Route path="/create-audition" element={<CreateAudition />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/networking" element={<Networking />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
