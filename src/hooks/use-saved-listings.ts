'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast"

export const useSavedListings = () => {
  const [savedListingIds, setSavedListingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedListings');
      if (saved) {
        setSavedListingIds(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error("Could not read saved listings from localStorage", error);
    }
  }, []);

  const toggleSaveListing = useCallback((listingId: string) => {
    setSavedListingIds(prev => {
      const newSet = new Set(prev);
      let message = '';
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
        message = 'Listing removed from your favorites.';
      } else {
        newSet.add(listingId);
        message = 'Listing added to your favorites!';
      }
      
      try {
        localStorage.setItem('savedListings', JSON.stringify(Array.from(newSet)));
        toast({ title: message });
      } catch (error) {
        console.error("Could not save to localStorage", error);
        toast({ title: 'Could not update favorites.', variant: 'destructive' });
      }

      return newSet;
    });
  }, [toast]);

  return { savedListingIds, toggleSaveListing };
};
