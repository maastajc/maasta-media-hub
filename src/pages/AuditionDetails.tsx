import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Briefcase, 
  Share2, 
  ChevronRight,
  Home,
  DollarSign,
  Users,
  Award,
  Phone,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuditionApplicationDialog from '@/components/auditions/AuditionApplicationDialog';

interface Audition {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  deadline: string | null;
  audition_date: string | null;
  project_details: string | null;
  compensation: string | null;
  category: string | null;
  age_range: string | null;
  gender: string | null;
  experience_level: string | null;
  tags: string[] | null;
  creator_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AuditionDetails = () => {
  const { auditionId } = useParams<{ auditionId: string }>();
  const [audition, setAudition] = useState<Audition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auditionId) {
      fetchAudition();
    }
  }, [auditionId]);

  const fetchAudition = async () => {
    if (!auditionId) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching audition with ID:', auditionId);
      
      const { data, error } = await supabase
        .from('auditions')
        .select('*')
        .eq('id', auditionId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Audition data:', data);
      setAudition(data);
    } catch (error: any) {
      console.error('Error fetching audition:', error);
      toast({
        title: "Error",
        description: "Failed to load audition details",
        variant: "destructive",
      });
      navigate('/auditions');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audition?.title,
          text: audition?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Audition link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maasta-purple mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading audition details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!audition) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audition not found</h2>
            <p className="text-gray-600 mb-4">The audition you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/auditions')}>
              Back to Auditions
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-maasta-purple flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/auditions" className="hover:text-maasta-purple">
                Auditions
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium truncate">{audition.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-maasta-purple to-maasta-orange py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between text-white">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  {audition.category && (
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                      {audition.category}
                    </Badge>
                  )}
                  {audition.experience_level && (
                    <Badge className="bg-white/10 text-white border-white/20 text-lg px-4 py-2">
                      {audition.experience_level}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{audition.title}</h1>
                <div className="flex items-center space-x-6 text-lg text-gray-200">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {audition.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Posted {formatDate(audition.created_at)}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={handleShare} variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {user && user.id !== audition.creator_id && (
                  <Button 
                    onClick={() => setShowApplicationDialog(true)}
                    className="bg-white text-maasta-purple hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Opportunity</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{audition.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{audition.requirements}</p>
                  </div>
                </CardContent>
              </Card>

              {audition.project_details && (
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{audition.project_details}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {audition.compensation && (
                <Card className="overflow-hidden shadow-lg border-l-4 border-l-green-500">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                      Compensation
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{audition.compensation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {audition.tags && audition.tags.length > 0 && (
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Tags</h2>
                    <div className="flex flex-wrap gap-3">
                      {audition.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-base px-4 py-2 bg-maasta-purple/10 text-maasta-purple">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-6 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Calendar className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Application Deadline</p>
                        <p className="text-gray-600">{formatDateTime(audition.deadline)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Audition Date</p>
                        <p className="text-gray-600">{formatDateTime(audition.audition_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Location</p>
                        <p className="text-gray-600">{audition.location}</p>
                      </div>
                    </div>

                    {audition.age_range && (
                      <div className="flex items-start space-x-4">
                        <Users className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Age Range</p>
                          <p className="text-gray-600">{audition.age_range}</p>
                        </div>
                      </div>
                    )}

                    {audition.gender && (
                      <div className="flex items-start space-x-4">
                        <User className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Gender</p>
                          <p className="text-gray-600">{audition.gender}</p>
                        </div>
                      </div>
                    )}

                    {audition.experience_level && (
                      <div className="flex items-start space-x-4">
                        <Award className="w-6 h-6 text-maasta-purple mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Experience Level</p>
                          <p className="text-gray-600">{audition.experience_level}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {user && user.id !== audition.creator_id && (
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setShowApplicationDialog(true)}
                        className="w-full bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white font-semibold py-4 text-lg"
                        size="lg"
                      >
                        Apply for This Audition
                      </Button>
                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  )}

                  {user && user.id === audition.creator_id && (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => navigate(`/auditions/${audition.id}/edit`)}
                        className="w-full bg-maasta-purple hover:bg-maasta-purple/90 text-white"
                      >
                        Edit Audition
                      </Button>
                      <Button 
                        onClick={() => navigate(`/auditions/${audition.id}/applications`)}
                        variant="outline"
                        className="w-full"
                      >
                        View Applications
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showApplicationDialog && (
        <AuditionApplicationDialog
          auditionId={audition.id}
          auditionTitle={audition.title}
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          onSuccess={() => {
            setShowApplicationDialog(false);
            toast({
              title: "Application submitted",
              description: "Your application has been submitted successfully",
            });
          }}
        />
      )}
    </div>
  );
};

export default AuditionDetails;
