import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Artist } from "@/types/artist";
import { generatePortfolioPDF, PDFGenerationOptions } from "@/utils/portfolioPdfGenerator";
import { toast } from "sonner";

interface DownloadPortfolioPDFProps {
  artist: Artist;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const DownloadPortfolioPDF = ({ 
  artist, 
  variant = "outline", 
  size = "default",
  className = ""
}: DownloadPortfolioPDFProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      const options: PDFGenerationOptions = {
        includeProfilePicture: true,
        includeCoverImage: false, // Skip cover image for now as it complicates layout
        includeMedia: true,
        watermark: true,
      };

      await generatePortfolioPDF(artist, options);
      
      toast.success("Portfolio PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      {isGenerating ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
      {isGenerating ? "Generating PDF..." : "Download Portfolio"}
    </Button>
  );
};

export default DownloadPortfolioPDF;