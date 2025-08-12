
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WORK_PREFERENCE_CATEGORIES, WORK_PREFERENCE_GROUPS } from "@/constants/workPreferences";

interface AuditionCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  onCustomCategoryChange?: (customCategory: string) => void;
}

// Use work preference categories for consistency across platform
const AUDITION_CATEGORIES = WORK_PREFERENCE_CATEGORIES.map(cat => ({
  value: cat.value,
  label: cat.label,
  group: cat.group
})).concat([{ value: "other", label: "Other", group: "Custom" }]);

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
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {WORK_PREFERENCE_GROUPS.map((group) => (
              <div key={group}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {group}
                </div>
                {AUDITION_CATEGORIES
                  .filter((cat) => cat.group === group)
                  .map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
              </div>
            ))}
            <div key="custom">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Custom
              </div>
              <SelectItem value="other">Other (Specify below)</SelectItem>
            </div>
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
