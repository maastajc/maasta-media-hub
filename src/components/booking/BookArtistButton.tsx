import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookArtistDialog } from "./BookArtistDialog";
import { Calendar } from "lucide-react";

interface BookArtistButtonProps {
  artistId: string;
  artistName: string;
  artistCategory: string;
}

export const BookArtistButton = ({ artistId, artistName, artistCategory }: BookArtistButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="w-full flex items-center gap-2"
        variant="default"
      >
        <Calendar className="h-4 w-4" />
        Book Artist
      </Button>
      
      <BookArtistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        artistId={artistId}
        artistName={artistName}
        artistCategory={artistCategory}
      />
    </>
  );
};