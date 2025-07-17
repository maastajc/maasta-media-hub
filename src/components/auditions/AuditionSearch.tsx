
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface AuditionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const AuditionSearch = ({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search auditions by title, location, or requirements..." 
}: AuditionSearchProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 pr-20 py-3 w-full"
        />
        {localQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-maasta-orange hover:bg-maasta-orange/90 text-white rounded-md shadow-sm"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default AuditionSearch;
