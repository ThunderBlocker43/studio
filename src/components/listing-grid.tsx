'use client';

import type { CategorizeListingOutput } from '@/ai/flows/categorize-listing';
import { ListingCard } from '@/components/listing-card';
import type { FiltersState, Listing } from '@/lib/types';
import { getDistance } from '@/lib/utils';
import { useMemo } from 'react';

interface ListingGridProps {
  listings: Listing[];
  filters: FiltersState;
  categories: Map<string, CategorizeListingOutput>;
  onCategoryLoaded: (listingId: string, category: CategorizeListingOutput) => void;
}

const SCHOOL_RADIUS_KM = 2.5;

export function ListingGrid({ listings, filters, categories, onCategoryLoaded }: ListingGridProps) {
  const filteredAndSortedListings = useMemo(() => {
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
      result = result.filter(l => {
        const category = categories.get(l.id);
        return category?.suitability === filters.suitability;
      });
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
  }, [listings, filters, categories]);
  
  return (
    <div className="flex-1 px-6 pb-6">
       {filteredAndSortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredAndSortedListings.map(listing => (
            <ListingCard
                key={listing.id}
                listing={listing}
                category={categories.get(listing.id) || null}
                onCategoryLoaded={onCategoryLoaded}
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
