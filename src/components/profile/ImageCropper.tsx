
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { X, Check } from "lucide-react";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageUrl: string;
}

const ImageCropper = ({ isOpen, onClose, onCropComplete, imageUrl }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
    }
  }, [isOpen, imageUrl]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use original image dimensions to maintain resolution
    const size = Math.min(image.width, image.height);
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);
    
    // Save context
    ctx.save();
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();
    
    // Calculate crop area (center square)
    const offsetX = (image.width - size) / 2;
    const offsetY = (image.height - size) / 2;
    
    // Draw the cropped image at original resolution
    ctx.drawImage(
      image,
      offsetX, offsetY, size, size,  // source rectangle
      0, 0, size, size               // destination rectangle
    );
    
    // Restore context
    ctx.restore();
    
    // Draw clean circle border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI);
    ctx.stroke();
  };

  useEffect(() => {
    drawCanvas();
  }, [imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCropConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert to blob at original quality
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 1.0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>
            Your image will be cropped to a circle while maintaining original quality and resolution.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop Canvas */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto flex items-center justify-center" style={{ width: '300px', height: '300px' }}>
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
              style={{ 
                width: 'auto',
                height: 'auto',
                maxWidth: '300px',
                maxHeight: '300px'
              }}
            />
            
            {/* Hidden image for processing */}
            <img
              ref={imageRef}
              src={imageUrl}
              onLoad={handleImageLoad}
              className="hidden"
              alt="Crop source"
            />
          </div>

          <p className="text-xs text-gray-500 text-center">
            Image will be automatically cropped to a perfect circle while preserving original quality
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleCropConfirm}
            className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
            disabled={!imageLoaded}
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
