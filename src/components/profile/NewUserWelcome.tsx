
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Star, 
  Camera, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface NewUserWelcomeProps {
  onGetStarted: () => void;
  userName?: string;
}

const NewUserWelcome = ({ onGetStarted, userName }: NewUserWelcomeProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: User,
      title: "Welcome to Maasta!",
      description: `Hi ${userName || 'there'}! Let's set up your artist profile to get started.`,
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Star,
      title: "Build Your Portfolio",
      description: "Add your projects, skills, and experience to showcase your talent.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Camera,
      title: "Share Your Work",
      description: "Upload photos, videos, and media to create an impressive portfolio.",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Briefcase,
      title: "Find Opportunities",
      description: "Discover auditions, events, and connect with other artists.",
      color: "bg-green-50 text-green-600"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onGetStarted();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maasta-purple/10 to-maasta-orange/10 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">{step.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {step.description}
          </p>

          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-maasta-orange' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Features preview */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Education</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
            </div>
          )}

          <Button 
            onClick={nextStep}
            className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white font-medium py-3"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Set Up My Profile
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {currentStep === 0 && (
            <Button 
              variant="ghost" 
              onClick={onGetStarted}
              className="w-full text-gray-500"
            >
              Skip and go to profile
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserWelcome;
