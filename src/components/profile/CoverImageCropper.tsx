
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { X, Check, Move, ZoomIn, ZoomOut } from "lucide-react";

interface CoverImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageUrl: string;
}

const CoverImageCropper = ({ isOpen, onClose, onCropComplete, imageUrl }: CoverImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 16:9 aspect ratio for cover images
  const aspectRatio = 16 / 9;
  const canvasWidth = 400;
  const canvasHeight = canvasWidth / aspectRatio;

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [isOpen, imageUrl]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas with gray background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate scaled dimensions maintaining aspect ratio
    const imageAspect = image.width / image.height;
    let drawWidth, drawHeight;
    
    if (imageAspect > aspectRatio) {
      // Image is wider - fit to height
      drawHeight = canvasHeight * scale;
      drawWidth = drawHeight * imageAspect;
    } else {
      // Image is taller - fit to width
      drawWidth = canvasWidth * scale;
      drawHeight = drawWidth / imageAspect;
    }
    
    // Calculate position with offset
    const x = (canvasWidth - drawWidth) / 2 + offsetX;
    const y = (canvasHeight - drawHeight) / 2 + offsetY;
    
    // Draw the image
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
    
    // Draw crop area border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    drawCanvas();
  }, [imageLoaded, scale, offsetX, offsetY]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newOffsetX = e.clientX - dragStart.x;
    const newOffsetY = e.clientY - dragStart.y;
    
    // Limit movement to reasonable bounds
    const maxOffset = 100;
    setOffsetX(Math.max(-maxOffset, Math.min(maxOffset, newOffsetX)));
    setOffsetY(Math.max(-maxOffset, Math.min(maxOffset, newOffsetY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const resetPosition = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(1);
  };

  const handleCropConfirm = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    // Create a high-resolution canvas for final output
    const outputCanvas = document.createElement('canvas');
    const finalWidth = 1200; // High resolution for cover image
    const finalHeight = finalWidth / aspectRatio;
    
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;
    
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // Calculate scaling factors
    const scaleFactorX = finalWidth / canvasWidth;
    const scaleFactorY = finalHeight / canvasHeight;

    // Calculate the image dimensions and position for final output
    const imageAspect = image.width / image.height;
    let drawWidth, drawHeight;
    
    if (imageAspect > aspectRatio) {
      drawHeight = finalHeight * scale;
      drawWidth = drawHeight * imageAspect;
    } else {
      drawWidth = finalWidth * scale;
      drawHeight = drawWidth / imageAspect;
    }
    
    const x = (finalWidth - drawWidth) / 2 + (offsetX * scaleFactorX);
    const y = (finalHeight - drawHeight) / 2 + (offsetY * scaleFactorY);

    // Draw the final cropped image
    ctx.drawImage(image, x, y, drawWidth, drawHeight);

    // Convert to blob
    outputCanvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Cover Image</DialogTitle>
          <DialogDescription>
            Adjust the position and size of your cover image. Drag to move, use the slider to zoom.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop Canvas */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto flex items-center justify-center" 
               style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
            <canvas
              ref={canvasRef}
              className="cursor-move"
              style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ZoomOut className="w-4 h-4 text-gray-500" />
              <Slider
                value={[scale]}
                onValueChange={handleScaleChange}
                min={0.5}
                max={2}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetPosition}
                className="flex items-center gap-2"
              >
                <Move className="w-4 h-4" />
                Reset Position
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Drag the image to reposition • Use the slider to zoom in/out
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

export default CoverImageCropper;
