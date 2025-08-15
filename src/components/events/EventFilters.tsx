import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, DollarSign, Tag, RotateCcw } from "lucide-react";

interface Filters {
  search: string;
  category: string;
  location: string;
  dateRange: string;
  priceRange: string;
}

interface EventFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortBy: string;
  setSortBy: (value: string) => void;
  onClear: () => void;
}

const EventFilters = ({ filters, setFilters, sortBy, setSortBy, onClear }: EventFiltersProps) => {
  return (
    <Card className="border-t-0 rounded-t-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="contests">🎭 Contests</SelectItem>
                <SelectItem value="concerts">🎤 Concerts</SelectItem>
                <SelectItem value="meetups">🤝 Meetups</SelectItem>
                <SelectItem value="cultural">🎓 Cultural Fests</SelectItem>
                <SelectItem value="screenings">🎬 Screenings</SelectItem>
                <SelectItem value="workshops">🎨 Workshops</SelectItem>
                <SelectItem value="shows">🎟 Live Shows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="weekend">This Weekend</SelectItem>
                <SelectItem value="week">Next 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price
            </Label>
            <Select 
              value={filters.priceRange} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Price</SelectItem>
                <SelectItem value="free">Free Events</SelectItem>
                <SelectItem value="paid">Paid Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="price_low">Price ↑</SelectItem>
                  <SelectItem value="price_high">Price ↓</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={onClear}
                title="Clear all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { EventFilters };