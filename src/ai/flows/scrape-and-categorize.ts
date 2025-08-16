
'use server';

/**
 * @fileOverview A flow that scrapes listings from a URL and then categorizes them.
 * 
 * - scrapeAndCategorize - Scrapes and categorizes listings from a given URL.
 * - ScrapeAndCategorizeInput - The input type for the scrapeAndCategorize function.
 * - ScrapedListing - The shape of a single scraped listing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { scrapeListings } from '@/services/scraping.service';
import { batchCategorizeListings } from './categorize-listing';
import type { Listing } from '@/lib/types';
import type { CategorizeListingOutput } from './categorize-listing';

const ScrapeAndCategorizeInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to scrape for listings.'),
});
export type ScrapeAndCategorizeInput = z.infer<typeof ScrapeAndCategorizeInputSchema>;

export type ScrapedListing = Listing & {
    category: CategorizeListingOutput;
};

export async function scrapeAndCategorize(input: ScrapeAndCategorizeInput): Promise<ScrapedListing[]> {
  return scrapeAndCategorizeFlow(input);
}

const scrapeAndCategorizeFlow = ai.defineFlow(
  {
    name: 'scrapeAndCategorizeFlow',
    inputSchema: ScrapeAndCategorizeInputSchema,
    outputSchema: z.array(z.any()),
  },
  async ({ url }) => {
    // Step 1: Scrape the raw listing data from the URL.
    const scrapedListings = await scrapeListings(url);

    if (!scrapedListings || scrapedListings.length === 0) {
        console.log("No listings found during scraping.");
        return [];
    }

    // Step 2: Prepare the listings for categorization.
    const listingInputs = scrapedListings.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
    }));

    // Step 3: Categorize the listings using the other AI flow.
    const categorizationResults = await batchCategorizeListings({ listings: listingInputs });
    
    const categoriesMap = new Map(
      categorizationResults.categorizations.map(c => [c.id, c])
    );

    // Step 4: Combine the scraped data with the categorization results.
    const combinedListings: ScrapedListing[] = scrapedListings.map(listing => ({
      ...listing,
      category: categoriesMap.get(listing.id) || { suitability: 'unsuitable', reason: 'Could not be categorized.' },
    }));

    return combinedListings;
  }
);
