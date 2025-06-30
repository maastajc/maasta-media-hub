
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { X, Check, RotateCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageUrl: string;
}

const ImageCropper = ({ isOpen, onClose, onCropComplete, imageUrl }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
      setScale([1]);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
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

    // Clear canvas with light background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Save context
    ctx.save();
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 10, 0, 2 * Math.PI);
    ctx.clip();
    
    // Move to center
    ctx.translate(canvasSize / 2, canvasSize / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply scaling and positioning
    const scaledWidth = image.width * scale[0];
    const scaledHeight = image.height * scale[0];
    
    ctx.drawImage(
      image,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );
    
    // Restore context
    ctx.restore();
    
    // Draw clean circle border (no dashed lines)
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 10, 0, 2 * Math.PI);
    ctx.stroke();
  };

  useEffect(() => {
    drawCanvas();
  }, [scale, rotation, position, imageLoaded]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Directional movement functions
  const moveImage = (direction: 'up' | 'down' | 'left' | 'right') => {
    const moveAmount = 10;
    setPosition(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: prev.y - moveAmount };
        case 'down':
          return { ...prev, y: prev.y + moveAmount };
        case 'left':
          return { ...prev, x: prev.x - moveAmount };
        case 'right':
          return { ...prev, x: prev.x + moveAmount };
        default:
          return prev;
      }
    });
  };

  const handleCropConfirm = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    // Create final crop canvas with high quality
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    const cropSize = 400;
    cropCanvas.width = cropSize;
    cropCanvas.height = cropSize;

    // Create circular clip
    cropCtx.beginPath();
    cropCtx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, 2 * Math.PI);
    cropCtx.clip();

    // Apply transformations and draw image
    cropCtx.save();
    cropCtx.translate(cropSize / 2, cropSize / 2);
    cropCtx.rotate((rotation * Math.PI) / 180);
    
    const scaledWidth = image.width * scale[0] * (cropSize / 300);
    const scaledHeight = image.height * scale[0] * (cropSize / 300);
    
    cropCtx.drawImage(
      image,
      -scaledWidth / 2 + (position.x * cropSize / 300),
      -scaledHeight / 2 + (position.y * cropSize / 300),
      scaledWidth,
      scaledHeight
    );
    
    cropCtx.restore();

    // Convert to blob with maximum quality (no quality loss)
    cropCanvas.toBlob((blob) => {
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
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop Canvas */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto" style={{ width: '300px', height: '300px' }}>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="cursor-move block"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width: '300px', height: '300px' }}
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
            {/* Zoom Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={scale}
                onValueChange={setScale}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
            
            {/* Movement Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveImage('up')}
                  className="p-2"
                >
                  <ArrowUp size={16} />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveImage('left')}
                  className="p-2"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveImage('right')}
                  className="p-2"
                >
                  <ArrowRight size={16} />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveImage('down')}
                  className="p-2"
                >
                  <ArrowDown size={16} />
                </Button>
                <div></div>
              </div>
            </div>
            
            {/* Rotate and Reset */}
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((prev) => prev + 90)}
              >
                <RotateCw size={16} className="mr-1" />
                Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale([1]);
                  setRotation(0);
                  setPosition({ x: 0, y: 0 });
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Drag to reposition • Use directional buttons for precise movement • Use zoom slider to scale
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
