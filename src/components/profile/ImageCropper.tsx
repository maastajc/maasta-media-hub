
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { X, Check, Move, ZoomIn, ZoomOut } from "lucide-react";

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
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    const canvasSize = 300;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Calculate scaled dimensions
    const scaledWidth = Math.min(image.width, image.height) * scale;
    const scaledHeight = Math.min(image.width, image.height) * scale;
    
    // Calculate position with offset
    const x = (canvasSize - scaledWidth) / 2 + offsetX;
    const y = (canvasSize - scaledHeight) / 2 + offsetY;
    
    // Save context
    ctx.save();
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, 2 * Math.PI);
    ctx.clip();
    
    // Draw the image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Restore context
    ctx.restore();
    
    // Draw circle border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 1, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw crop overlay
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 1, 0, 2 * Math.PI);
    ctx.stroke();
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
    const maxOffset = 50;
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
    const outputSize = Math.min(image.width, image.height);
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // Calculate the crop area based on current view
    const scaledSize = outputSize * scale;
    const x = (outputSize - scaledSize) / 2 + (offsetX * outputSize / 300);
    const y = (outputSize - scaledSize) / 2 + (offsetY * outputSize / 300);

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the final cropped image
    ctx.drawImage(image, x, y, scaledSize, scaledSize);

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
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>
            Adjust the position and size of your image. Drag to move, use the slider to zoom.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop Canvas */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto flex items-center justify-center" 
               style={{ width: '300px', height: '300px' }}>
            <canvas
              ref={canvasRef}
              className="cursor-move"
              style={{ width: '300px', height: '300px' }}
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

export default ImageCropper;
