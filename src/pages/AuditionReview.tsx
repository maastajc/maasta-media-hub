
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApplicationsForCreator, updateApplicationStatus } from "@/services/auditionApplicationService";
import { updateApplicationNotes } from "@/services/auditionApplicationService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Globe,
  Linkedin,
  Youtube,
  User,
  MessageSquare
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuditionApplication } from "@/services/auditionApplicationService";
import { ReviewSummary } from "@/components/audition-review/ReviewSummary";
import { ApplicationDetailsCard } from "@/components/audition-review/ApplicationDetailsCard";
import { ReviewActions } from "@/components/audition-review/ReviewActions";

const AuditionReview = () => {
  const { auditionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<AuditionApplication[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !auditionId) {
      navigate("/sign-in");
      return;
    }
    fetchApplications();
  }, [user, auditionId, navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (applications.length === 0) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applications.length, currentIndex]);

  const fetchApplications = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApplicationsForCreator(user.id);
      
      // Filter applications for this specific audition
      const auditionApplications = data.filter(app => app.audition_id === auditionId);
      
      if (auditionApplications.length === 0) {
        setError("No applications found for this audition.");
        return;
      }

      setApplications(auditionApplications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to load applications');
      toast({
        title: "Error",
        description: "Failed to load audition applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentApplication = applications[currentIndex];

  const goToNext = () => {
    if (currentIndex < applications.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setNotes(applications[currentIndex + 1]?.organizer_notes || "");
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setNotes(applications[currentIndex - 1]?.organizer_notes || "");
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!currentApplication) return;

    // Warn before changing already processed applications
    if (currentApplication.status !== 'pending' && currentApplication.status !== newStatus) {
      const confirmed = window.confirm(
        `This applicant is already marked as "${currentApplication.status}". Are you sure you want to change it to "${newStatus}"?`
      );
      if (!confirmed) return;
    }

    try {
      setIsUpdating(true);
      const success = await updateApplicationStatus(currentApplication.id, newStatus);
      
      if (success) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === currentApplication.id 
              ? { ...app, status: newStatus }
              : app
          )
        );

        // Save notes if any
        if (notes.trim() && notes !== currentApplication.organizer_notes) {
          await updateApplicationNotes(currentApplication.id, notes.trim());
          setApplications(prev => 
            prev.map(app => 
              app.id === currentApplication.id 
                ? { ...app, organizer_notes: notes.trim() }
                : app
            )
          );
        }

        toast({
          title: "Status Updated",
          description: `Application ${newStatus === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully`,
        });

        // Auto-advance to next application
        if (currentIndex < applications.length - 1) {
          setTimeout(() => goToNext(), 500);
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    if (!currentApplication || notes === currentApplication.organizer_notes) return;

    try {
      await updateApplicationNotes(currentApplication.id, notes);
      setApplications(prev => 
        prev.map(app => 
          app.id === currentApplication.id 
            ? { ...app, organizer_notes: notes }
            : app
        )
      );
      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const getStatusCounts = () => {
    const total = applications.length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    
    return { total, shortlisted, rejected, pending };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || applications.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <User className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-2xl font-bold mb-2">No Applications Found</h2>
            <p className="text-gray-600 mb-4">
              {error || "No applications have been submitted for this audition yet."}
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Review Applications</h1>
              <Button
                onClick={() => navigate(`/applications/${auditionId}`)}
                variant="outline"
              >
                Back to Applications List
              </Button>
            </div>
            <p className="text-gray-600">
              {currentApplication?.audition?.title}
            </p>
          </div>

          {/* Summary Stats */}
          <ReviewSummary {...statusCounts} />

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Application {currentIndex + 1} of {applications.length}</span>
              <span>{Math.round(((currentIndex + 1) / applications.length) * 100)}% reviewed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-maasta-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / applications.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Review Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Application Details */}
            <div className="lg:col-span-2">
              <ApplicationDetailsCard application={currentApplication} />
            </div>

            {/* Review Actions */}
            <div className="space-y-6">
              <ReviewActions
                application={currentApplication}
                isUpdating={isUpdating}
                onStatusUpdate={handleStatusUpdate}
              />

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    Private Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add your notes about this applicant..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleNotesUpdate}
                    variant="outline"
                    size="sm"
                    disabled={notes === currentApplication?.organizer_notes}
                  >
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Use ← → arrow keys to navigate
            </div>

            <Button
              onClick={goToNext}
              disabled={currentIndex === applications.length - 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuditionReview;
