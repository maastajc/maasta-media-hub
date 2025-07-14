
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { AuditionApplication } from "@/services/auditionApplicationService";
import { generatePortfolioPDF, PDFGenerationOptions } from "@/utils/portfolioPdfGenerator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Artist, ArtistCategory, ExperienceLevel } from "@/types/artist";

interface DownloadApplicantPortfolioProps {
  application: AuditionApplication;
  className?: string;
}

const DownloadApplicantPortfolio = ({ 
  application, 
  className = ""
}: DownloadApplicantPortfolioProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  // Check if current user is the audition creator
  const canDownload = user?.id === application.audition?.creator_id;

  const handleDownloadPDF = async () => {
    if (!canDownload || !application.artist) {
      toast.error("You don't have permission to download this portfolio");
      return;
    }

    setIsGenerating(true);
    
    try {
      const options: PDFGenerationOptions = {
        includeProfilePicture: true,
        includeCoverImage: false,
        includeMedia: true,
        watermark: true,
      };

      // Convert the artist data to the expected format with proper type casting
      const artistData: Artist = {
        ...application.artist,
        // Ensure category is properly typed - fallback to 'actor' if invalid
        category: (application.artist.category as ArtistCategory) || 'actor',
        // Ensure experience_level is properly typed - fallback to 'beginner' if invalid
        experience_level: (application.artist.experience_level as ExperienceLevel) || 'beginner',
        // Add any missing fields that might be expected by the PDF generator
        projects: [],
        media_assets: [],
        special_skills: [],
        education: [],
        education_training: [],
        language_skills: [],
        tools_software: [],
        awards: [],
        professional_references: [],
        skills: [], // Add backward compatibility field
      };

      await generatePortfolioPDF(artistData, options);
      
      toast.success(`${application.artist.full_name}'s portfolio downloaded successfully!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Don't render if user doesn't have permission
  if (!canDownload) {
    return null;
  }

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      {isGenerating ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      {isGenerating ? "Generating..." : "Download Portfolio PDF"}
    </Button>
  );
};

export default DownloadApplicantPortfolio;
