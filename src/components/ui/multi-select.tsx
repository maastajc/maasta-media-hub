import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxDisplay?: number;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  maxDisplay = 3,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, MultiSelectOption[]> = {};
    
    options.forEach((option) => {
      const group = option.group || "Other";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
    });
    
    return groups;
  }, [options]);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    
    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map((option) => option.label).join(", ");
    }
    
    return `${selectedOptions.slice(0, maxDisplay).map((option) => option.label).join(", ")} +${selectedOptions.length - maxDisplay} more`;
  }, [selectedOptions, maxDisplay, placeholder]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 px-3 py-2"
          >
            <span className="truncate text-left flex-1">
              {displayText}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-64">
              <CommandEmpty>{emptyText}</CommandEmpty>
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <CommandGroup key={group} heading={group}>
                  {groupOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected items as badges */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="text-xs py-1 px-2"
            >
              {option.label}
              <X
                className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(option.value);
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}