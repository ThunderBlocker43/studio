'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { schools } from '@/data/schools';
import type { FiltersState, School } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Filter, GraduationCap, ListFilter, School as SchoolIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FiltersProps {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  minPrice: number;
  maxPrice: number;
  disabled?: boolean;
}

export function Filters({ filters, setFilters, minPrice, maxPrice, disabled = false }: FiltersProps) {
  const handleSchoolChange = (schoolName: string) => {
    const school = schools.find(s => s.name === schoolName) || null;
    setFilters(prev => ({ ...prev, selectedSchool: school }));
  };

  return (
    <div className={cn(disabled && "opacity-50 pointer-events-none")}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold font-headline flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters &amp; Sorting
        </h2>

        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort by</Label>
          <Select
            value={filters.sortBy}
            onValueChange={value => setFilters(prev => ({ ...prev, sortBy: value }))}
            disabled={disabled}
          >
            <SelectTrigger id="sort-by" className="w-full">
              <SelectValue placeholder="Sort listings..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="area-desc">Area: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={value => setFilters(prev => ({ ...prev, priceRange: value }))}
            min={minPrice}
            max={maxPrice}
            step={50}
            className="mt-4"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold font-headline flex items-center gap-2">
          <ListFilter className="h-5 w-5" />
          Preferences
        </h2>

        <div className="space-y-2">
          <Label htmlFor="suitability">Suitability</Label>
          <Select
            value={filters.suitability}
            onValueChange={value => setFilters(prev => ({ ...prev, suitability: value as FiltersState['suitability'] }))}
            disabled={disabled}
          >
            <SelectTrigger id="suitability" className="w-full">
              <SelectValue placeholder="Select suitability..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="student-friendly">Student-Friendly</SelectItem>
              <SelectItem value="long-term resident">Long-Term Resident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">Find near a school</Label>
          <Select onValueChange={handleSchoolChange} disabled={disabled}>
            <SelectTrigger id="school" className="w-full">
                <div className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-muted-foreground'/>
                    <SelectValue placeholder="Select a school..." />
                </div>
            </SelectTrigger>
            <SelectContent>
              {schools.map(school => (
                <SelectItem key={school.name} value={school.name}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
