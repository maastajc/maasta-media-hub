
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuditionCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  onCustomCategoryChange?: (customCategory: string) => void;
}

const AUDITION_CATEGORIES = [
  "Film",
  "TV Show",
  "Theater",
  "Commercial",
  "Music Video",
  "Voice Over",
  "Modeling",
  "Dance",
  "Stand-up Comedy",
  "Web Series",
  "Documentary",
  "Short Film",
  "other"
];

const AuditionCategorySelect = ({ value, onChange, onCustomCategoryChange }: AuditionCategorySelectProps) => {
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(value === "other");

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    if (newValue === "other") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomCategory("");
      if (onCustomCategoryChange) {
        onCustomCategoryChange("");
      }
    }
  };

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    if (onCustomCategoryChange) {
      onCustomCategoryChange(value);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select audition category" />
          </SelectTrigger>
          <SelectContent>
            {AUDITION_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "other" ? "Other (Specify below)" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomInput && (
        <div>
          <Label htmlFor="customCategory">Custom Category</Label>
          <Input
            id="customCategory"
            placeholder="Please specify the audition category"
            value={customCategory}
            onChange={(e) => handleCustomCategoryChange(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be reviewed for potential addition to our category list.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditionCategorySelect;
