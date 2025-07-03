
import React, { useState } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateOfBirthPickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateOfBirthPicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Select date of birth",
  className = ""
}: DateOfBirthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(date ? date.getFullYear().toString() : "");
  const [selectedMonth, setSelectedMonth] = useState<string>(date ? date.getMonth().toString() : "");
  const [selectedDay, setSelectedDay] = useState<string>(date ? date.getDate().toString() : "");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate years from 1920 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);

  // Get days in selected month/year
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const selectedYearNum = selectedYear ? parseInt(selectedYear) : currentYear;
  const selectedMonthNum = selectedMonth ? parseInt(selectedMonth) : 0;
  const daysInMonth = getDaysInMonth(selectedMonthNum, selectedYearNum);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateSelection = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const newDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), parseInt(selectedDay));
      onDateChange(newDate);
      setIsOpen(false);
    }
  };

  const resetSelections = () => {
    if (date) {
      setSelectedYear(date.getFullYear().toString());
      setSelectedMonth(date.getMonth().toString());
      setSelectedDay(date.getDate().toString());
    } else {
      setSelectedYear("");
      setSelectedMonth("");
      setSelectedDay("");
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      resetSelections();
    }
  }, [isOpen, date]);

  // Auto-select date when all three are selected
  React.useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay && isOpen) {
      handleDateSelection();
    }
  }, [selectedYear, selectedMonth, selectedDay, isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${className}`}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM d, yyyy") : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium text-center mb-3">Select Date of Birth</div>
          
          {/* Year Selection */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Selection */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={!selectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Day</label>
            <Select value={selectedDay} onValueChange={setSelectedDay} disabled={!selectedMonth || !selectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedYear && selectedMonth && selectedDay && (
            <div className="pt-2 border-t">
              <p className="text-sm text-center text-gray-600">
                Selected: {months[parseInt(selectedMonth)]} {selectedDay}, {selectedYear}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
