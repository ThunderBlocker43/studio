// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A listing categorization AI agent.
 *
 * - batchCategorizeListings - A function that handles batch listing categorization.
 * - BatchCategorizeListingsInput - The input type for the batchCategorizeListings function.
 * - BatchCategorizeListingsOutput - The return type for the batchCategorizeListings function.
 * - CategorizeListingOutput - The output type for a single categorization.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ListingInputSchema = z.object({
  id: z.string().describe('The unique identifier for the listing.'),
  title: z.string().describe('The title of the listing.'),
  description: z.string().describe('The description of the listing.'),
});

const CategorizationOutputSchema = z.object({
    id: z.string().describe('The unique identifier for the listing.'),
    suitability: z
        .enum(['student-friendly', 'long-term resident', 'unsuitable'])
        .describe("The suitability of the listing for different types of residents. Must be one of 'student-friendly', 'long-term resident', or 'unsuitable'."),
    reason: z.string().describe('The reasoning behind the categorization.'),
});

const BatchCategorizeListingsInputSchema = z.object({
  listings: z.array(ListingInputSchema),
});
export type BatchCategorizeListingsInput = z.infer<typeof BatchCategorizeListingsInputSchema>;

const BatchCategorizeListingsOutputSchema = z.object({
  categorizations: z.array(CategorizationOutputSchema),
});
export type BatchCategorizeListingsOutput = z.infer<typeof BatchCategorizeListingsOutputSchema>;


export type CategorizeListingOutput = z.infer<typeof CategorizationOutputSchema>;

export async function batchCategorizeListings(input: BatchCategorizeListingsInput): Promise<BatchCategorizeListingsOutput> {
  return categorizeListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'batchCategorizeListingPrompt',
  input: {schema: BatchCategorizeListingsInputSchema},
  output: {schema: BatchCategorizeListingsOutputSchema},
  prompt: `You are an expert real estate analyst specializing in categorizing accommodation listings.

You will receive a JSON array of listings. For each listing, you will use its title and description to determine whether it is most suitable for students, long-term residents, or unsuitable for either.

For each listing, you must return its ID, categorize it as either 'student-friendly', 'long-term resident', or 'unsuitable', and provide a brief reason for your categorization.

Listings:
{{{json listings}}}
`,
});

const categorizeListingFlow = ai.defineFlow(
  {
    name: 'categorizeListingFlow',
    inputSchema: BatchCategorizeListingsInputSchema,
    outputSchema: BatchCategorizeListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);