
'use client';

import type { ScrapedListing } from '@/ai/flows/scrape-and-categorize';
import { ListingCard } from '@/components/listing-card';
import type { FiltersState } from '@/lib/types';
import { getDistance } from '@/lib/utils';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

interface ListingGridProps {
  listings: ScrapedListing[];
  filters: FiltersState;
  isLoading: boolean;
}

const SCHOOL_RADIUS_KM = 2.5;

export function ListingGrid({ listings, filters, isLoading }: ListingGridProps) {
  const filteredAndSortedListings = useMemo(() => {
    if (isLoading) {
        return [];
    }

    let result = [...listings];

    // Filter by price
    result = result.filter(l => l.price >= filters.priceRange[0] && l.price <= filters.priceRange[1]);

    // Filter by school proximity
    if (filters.selectedSchool) {
      result = result.filter(l => {
        const distance = getDistance(
          l.location.lat,
          l.location.lng,
          filters.selectedSchool!.location.lat,
          filters.selectedSchool!.location.lng
        );
        return distance <= SCHOOL_RADIUS_KM;
      });
    }

    // Filter by suitability
    if (filters.suitability !== 'all') {
      result = result.filter(l => l.category.suitability === filters.suitability);
    }

    // Sort
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'area-desc') {
        result.sort((a, b) => b.details.area - a.details.area);
    }

    return result;
  }, [listings, filters, isLoading]);
  
  return (
    <div className="flex-1 px-6 pb-6">
       {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ListingCard key={i} listing={{} as ScrapedListing} isLoading={true} />
                ))}
            </div>
       ) : filteredAndSortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredAndSortedListings.map((listing) => (
            <ListingCard
                key={listing.id}
                listing={listing}
                isLoading={false}
            />
            ))}
        </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <h3 className="text-xl font-semibold">No Listings Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find more homes.</p>
            </div>
        )}
    </div>
  );
}
