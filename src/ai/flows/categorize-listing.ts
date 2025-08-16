// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A listing categorization AI agent.
 *
 * - categorizeListing - A function that handles the listing categorization process.
 * - CategorizeListingInput - The input type for the categorizeListing function.
 * - CategorizeListingOutput - The return type for the categorizeListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeListingInputSchema = z.object({
  title: z.string().describe('The title of the listing.'),
  description: z.string().describe('The description of the listing.'),
});
export type CategorizeListingInput = z.infer<typeof CategorizeListingInputSchema>;

const CategorizeListingOutputSchema = z.object({
  suitability: z
    .enum(['student-friendly', 'long-term resident', 'unsuitable'])
    .describe("The suitability of the listing for different types of residents.  Must be one of 'student-friendly', 'long-term resident', or 'unsuitable'."),
  reason: z.string().describe('The reasoning behind the categorization.'),
});
export type CategorizeListingOutput = z.infer<typeof CategorizeListingOutputSchema>;

export async function categorizeListing(input: CategorizeListingInput): Promise<CategorizeListingOutput> {
  return categorizeListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeListingPrompt',
  input: {schema: CategorizeListingInputSchema},
  output: {schema: CategorizeListingOutputSchema},
  prompt: `You are an expert real estate analyst specializing in categorizing accommodation listings.

You will use the listing title and description to determine whether the listing is most suitable for students, long-term residents, or unsuitable for either.

Title: {{{title}}}
Description: {{{description}}}

Categorize the listing as either 'student-friendly', 'long-term resident', or 'unsuitable'. Provide a brief reason for your categorization.
`,
});

const categorizeListingFlow = ai.defineFlow(
  {
    name: 'categorizeListingFlow',
    inputSchema: CategorizeListingInputSchema,
    outputSchema: CategorizeListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
