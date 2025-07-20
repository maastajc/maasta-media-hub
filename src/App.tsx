
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OnboardingRedirect } from "./components/auth/OnboardingRedirect";
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
import ScrollToTop from "./components/layout/ScrollToTop";

// Onboarding pages
import BasicInfo from "./pages/onboarding/BasicInfo";
import WorkPreference from "./pages/onboarding/WorkPreference";
import MediaPortfolio from "./pages/onboarding/MediaPortfolio";
import Projects from "./pages/onboarding/Projects";
import OnlineLinks from "./pages/onboarding/OnlineLinks";
import SkillsTools from "./pages/onboarding/SkillsTools";
import Complete from "./pages/onboarding/Complete";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <OnboardingRedirect>
              <ScrollToTop />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              
              {/* Onboarding Routes */}
              <Route path="/onboarding/basic-info" element={<BasicInfo />} />
              <Route path="/onboarding/work-preference" element={<WorkPreference />} />
              <Route path="/onboarding/media-portfolio" element={<MediaPortfolio />} />
              <Route path="/onboarding/projects" element={<Projects />} />
              <Route path="/onboarding/online-links" element={<OnlineLinks />} />
              <Route path="/onboarding/skills-tools" element={<SkillsTools />} />
              <Route path="/onboarding/complete" element={<Complete />} />
              
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
            </Routes>
            </OnboardingRedirect>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
