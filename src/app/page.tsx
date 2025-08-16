'use client';

import { batchCategorizeListings, type CategorizeListingOutput } from '@/ai/flows/categorize-listing';
import { Filters } from '@/components/filters';
import { Header } from '@/components/header';
import { ListingGrid } from '@/components/listing-grid';
import { MapView } from '@/components/map';
import { allListings } from '@/data/listings';
import type { Listing, School, Suitability } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const minPrice = Math.min(...allListings.map(l => l.price));
const maxPrice = Math.max(...allListings.map(l => l.price));

export default function Home() {
  const [filters, setFilters] = useState({
    priceRange: [minPrice, maxPrice],
    sortBy: 'price-asc',
    suitability: 'all' as Suitability,
    selectedSchool: null as School | null,
  });

  const [categories, setCategories] = useState<Map<string, CategorizeListingOutput>>(new Map());
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function getCategories() {
      try {
        const listingInputs = allListings.map(l => ({ id: l.id, title: l.title, description: l.description }));
        const results = await batchCategorizeListings({ listings: listingInputs });
        
        const newCategories = new Map<string, CategorizeListingOutput>();
        results.categorizations.forEach(result => {
          newCategories.set(result.id, { suitability: result.suitability, reason: result.reason });
        });
        setCategories(newCategories);
      } catch (error) {
        console.error("Failed to categorize listings", error);
        toast({
          title: "AI Error",
          description: "Could not categorize listings.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingCategories(false);
      }
    }
    getCategories();
  }, [toast]);


  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] overflow-hidden">
        <aside className="border-r border-border p-6 hidden lg:flex flex-col gap-8 overflow-y-auto">
          <Filters filters={filters} setFilters={setFilters} minPrice={minPrice} maxPrice={maxPrice} />
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold font-headline text-foreground">
              Find your next home in Leeuwarden
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse listings, find the perfect spot near your school, and save your favorites.
            </p>
          </div>
          
          <div className="px-6 pb-6">
             <MapView listings={allListings} />
          </div>

          <div className="px-6 pb-6 lg:hidden">
            {/* Mobile filters can be added here with a Sheet component */}
          </div>

          <ListingGrid
            listings={allListings}
            filters={filters}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
          />
        </main>
      </div>
    </div>
  );
}
