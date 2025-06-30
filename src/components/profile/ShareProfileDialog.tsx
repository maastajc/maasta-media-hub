
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Share, 
  Copy, 
  Mail,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Artist } from '@/types/artist';

interface ShareProfileDialogProps {
  artist: Artist;
}

const ShareProfileDialog = ({ artist }: ShareProfileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const profileUrl = `${window.location.origin}/artist/${artist.id}`;
  const shareText = `Check out ${artist.full_name}'s profile on Maasta`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(profileUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
      setIsOpen(false);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artist.full_name} - Maasta Profile`,
          text: shareText,
          url: profileUrl,
        });
        setIsOpen(false);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      action: () => {
        // Instagram doesn't support direct URL sharing, so copy to clipboard
        handleCopyLink();
        toast.info('Link copied! You can paste it in your Instagram story or post.');
      },
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(`Check out ${artist.full_name}'s profile`)}&body=${encodedText}%20${encodedUrl}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Copy Link',
      icon: Copy,
      action: handleCopyLink,
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-2 border-maasta-purple text-maasta-purple hover:bg-maasta-purple hover:text-white px-8 py-3 rounded-full font-medium text-lg"
        >
          <Share className="w-5 h-5 mr-2" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {artist.full_name}'s Profile</DialogTitle>
          <DialogDescription>
            Choose how you'd like to share this artist's profile
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Native Share Button (if supported) */}
          {navigator.share && (
            <Button
              onClick={handleNativeShare}
              className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white"
            >
              <Share className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}
          
          {/* Share Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              
              if (option.action) {
                return (
                  <Button
                    key={option.name}
                    onClick={option.action}
                    className={`${option.color} text-white flex flex-col items-center gap-2 h-20`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{option.name}</span>
                  </Button>
                );
              }
              
              return (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`${option.color} text-white flex flex-col items-center gap-2 h-20 rounded-md hover:opacity-90 transition-opacity justify-center no-underline`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{option.name}</span>
                </a>
              );
            })}
          </div>
          
          {/* Profile URL Display */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Profile URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white p-2 rounded border text-gray-600 break-all">
                {profileUrl}
              </code>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileDialog;
