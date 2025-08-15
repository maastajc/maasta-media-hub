
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import EditAudition from "./pages/EditAudition";
import Dashboard from "./pages/Dashboard";
import Networking from "./pages/Networking";
import AuditionApplications from "./pages/AuditionApplications";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import PaymentSuccess from "./pages/PaymentSuccess";
import ScrollToTop from "./components/layout/ScrollToTop";
import { BottomNavigation } from "./components/layout/BottomNavigation";
import { LayoutWithNavigation } from "./components/layout/LayoutWithNavigation";

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Index />;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <LayoutWithNavigation>
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:username" element={<ArtistProfile />} />
                <Route path="/auditions" element={<Auditions />} />
                <Route path="/auditions/create" element={<CreateAudition />} />
                <Route path="/auditions/edit/:auditionId" element={<EditAudition />} />
                <Route path="/auditions/:id" element={<AuditionDetails />} />
                <Route path="/create-audition" element={<CreateAudition />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/networking" element={<Networking />} />
                <Route path="/applications/:auditionId" element={<AuditionApplications />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/edit/:eventId" element={<EditEvent />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </LayoutWithNavigation>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
