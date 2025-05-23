
import React, { useState } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, setMonth, setYear, getYear, getMonth } from "date-fns";

interface MonthYearPickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MonthYearPicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Select date",
  className = ""
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(date || new Date());

  // An array of all months for the dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate array of years (from current year - 100 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  // Function to change month
  const changeMonth = (monthIndex: number) => {
    const newDate = setMonth(viewDate, monthIndex);
    setViewDate(newDate);
    onDateChange(newDate);
    setIsOpen(false);
  };

  // Function to change year
  const changeYear = (year: number) => {
    const newDate = setYear(viewDate, year);
    setViewDate(newDate);
    onDateChange(newDate);
    setIsOpen(false);
  };

  // Function to navigate years in dropdown
  const navigateYearSection = (direction: 'prev' | 'next') => {
    const yearsPerSection = 20;
    const currentYearIndex = years.findIndex(y => y === getYear(viewDate));
    
    let targetYear;
    if (direction === 'prev') {
      targetYear = years[Math.max(0, currentYearIndex - yearsPerSection)];
    } else {
      targetYear = years[Math.min(years.length - 1, currentYearIndex + yearsPerSection)];
    }
    
    const yearSectionElement = document.getElementById(`year-${targetYear}`);
    if (yearSectionElement) {
      yearSectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-full justify-start text-left font-normal ${className}`}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-3">
          {/* Month selection */}
          <div>
            <div className="text-sm font-medium mb-2">Month</div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, i) => (
                <Button
                  key={month}
                  size="sm"
                  variant={getMonth(viewDate) === i ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => changeMonth(i)}
                >
                  {month.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          {/* Year selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Year</div>
              <div className="flex gap-1">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7" 
                  onClick={() => navigateYearSection('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7" 
                  onClick={() => navigateYearSection('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 h-[180px] overflow-y-auto">
              {years.map((year) => (
                <Button
                  id={`year-${year}`}
                  key={year}
                  size="sm"
                  variant={getYear(viewDate) === year ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => changeYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
