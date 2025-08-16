'use client';

import { scrapeAndCategorize, type ScrapedListing } from '@/ai/flows/scrape-and-categorize';
import { Filters } from '@/components/filters';
import { Header } from '@/components/header';
import { ListingGrid } from '@/components/listing-grid';
import { MapView } from '@/components/map';
import type { School, Suitability } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allListings as fallbackListings } from '@/data/listings';

const KAMERNET_LEEUWARDEN_URL = "https://kamernet.nl/en/for-rent/rooms-leeuwarden";

export default function Home() {
  const [listings, setListings] = useState<ScrapedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: [0, 3000],
    sortBy: 'price-asc',
    suitability: 'all' as Suitability,
    selectedSchool: null as School | null,
  });

  const { toast } = useToast();

  useEffect(() => {
    async function getScrapedListings() {
      setIsLoading(true);
      try {
        const results = await scrapeAndCategorize({ url: KAMERNET_LEEUWARDEN_URL });
        setListings(results);

        if (results.length > 0) {
            const prices = results.map(l => l.price);
            setFilters(prev => ({
                ...prev,
                priceRange: [Math.min(...prices), Math.max(...prices)]
            }));
        }

      } catch (error) {
        console.error("Failed to scrape and categorize listings", error);
        toast({
          title: "AI Scraper Error",
          description: "Could not fetch listings. Displaying fallback data.",
          variant: "destructive"
        });
        // In case of an error, use the static data as a fallback.
        const fallbackAsScraped = fallbackListings.map(l => ({...l, category: {suitability: 'unsuitable', reason: 'N/A'}} as ScrapedListing))
        setListings(fallbackAsScraped);

      } finally {
        setIsLoading(false);
      }
    }
    getScrapedListings();
  }, [toast]);
  
  const minPrice = listings.length > 0 ? Math.min(...listings.map(l => l.price)) : 0;
  const maxPrice = listings.length > 0 ? Math.max(...listings.map(l => l.price)) : 3000;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] overflow-hidden">
        <aside className="border-r border-border p-6 hidden lg:flex flex-col gap-8 overflow-y-auto">
          <Filters 
            filters={filters} 
            setFilters={setFilters} 
            minPrice={minPrice} 
            maxPrice={maxPrice}
            disabled={isLoading}
          />
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold font-headline text-foreground">
              Find your next home in Leeuwarden
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? 'Searching for the latest listings...' : `Found ${listings.length} listings from Kamernet.`}
            </p>
          </div>
          
          <div className="px-6 pb-6">
             <MapView listings={listings} />
          </div>

          <div className="px-6 pb-6 lg:hidden">
            {/* Mobile filters can be added here with a Sheet component */}
          </div>

          <ListingGrid
            listings={listings}
            filters={filters}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}
