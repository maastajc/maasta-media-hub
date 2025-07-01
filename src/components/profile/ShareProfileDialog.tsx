
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Artist } from "@/types/artist";

interface ShareProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artist: Artist;
}

const ShareProfileDialog = ({ isOpen, onClose, artist }: ShareProfileDialogProps) => {
  const [copied, setCopied] = useState(false);
  
  const profileUrl = `${window.location.origin}/artists/${artist.id}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareToWhatsApp = () => {
    const message = `Check out ${artist.full_name}'s profile on Maasta! ${profileUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing with links, so we copy the link
    copyToClipboard();
    toast.success("Link copied! You can now paste it in your Instagram story or post.");
  };

  const shareToTwitter = () => {
    const message = `Check out ${artist.full_name}'s profile on Maasta! ${profileUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    window.open(linkedInUrl, '_blank');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Preview Card */}
          <Card className="bg-gradient-to-br from-maasta-orange/10 to-maasta-purple/10 border-2 border-maasta-orange/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                  <AvatarImage 
                    src={artist.profile_picture_url} 
                    alt={artist.full_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-maasta-orange text-white text-lg font-bold">
                    {getInitials(artist.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {artist.full_name}
                  </h3>
                  {artist.category && (
                    <Badge className="bg-maasta-orange text-white mb-2">
                      {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
                    </Badge>
                  )}
                  {artist.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {artist.bio}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  ✨ Powered by Maasta
                </div>
                {artist.years_of_experience !== undefined && (
                  <div className="text-xs text-gray-600 font-medium">
                    {artist.years_of_experience} years experience
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Copy Link Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Profile Link
            </label>
            <div className="flex gap-2">
              <Input
                value={profileUrl}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Share on Social Media
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={shareToWhatsApp}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-green-50 hover:border-green-300"
              >
                <span className="text-2xl">📱</span>
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button
                onClick={shareToInstagram}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-pink-50 hover:border-pink-300"
              >
                <span className="text-2xl">📸</span>
                <span className="text-xs">Instagram</span>
              </Button>
              
              <Button
                onClick={shareToTwitter}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
              >
                <span className="text-2xl">🐦</span>
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                onClick={shareToFacebook}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
              >
                <span className="text-2xl">👥</span>
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button
                onClick={shareToLinkedIn}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
              >
                <span className="text-2xl">💼</span>
                <span className="text-xs">LinkedIn</span>
              </Button>
              
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-gray-50 hover:border-gray-300"
              >
                <span className="text-2xl">🔗</span>
                <span className="text-xs">Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileDialog;
