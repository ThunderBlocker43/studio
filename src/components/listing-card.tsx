
'use client';

import type { CategorizeListingOutput } from '@/ai/flows/categorize-listing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSavedListings } from '@/hooks/use-saved-listings';
import type { Listing } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { Bath, BedDouble, Heart, Home, Info, MapPin, Ruler, University } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ListingCardProps {
  listing: Listing;
  category: CategorizeListingOutput | null;
  isLoading: boolean;
}

function SuitabilityBadge({ suitability }: { suitability: CategorizeListingOutput['suitability'] }) {
  const badgeVariants = {
    'student-friendly': 'default',
    'long-term resident': 'secondary',
    unsuitable: 'destructive',
  } as const;

  const badgeIcons = {
    'student-friendly': <University className="h-3 w-3" />,
    'long-term resident': <Home className="h-3 w-3" />,
    unsuitable: <Info className="h-3 w-3" />,
  }

  return (
    <Badge variant={badgeVariants[suitability]} className="flex items-center gap-1.5 capitalize">
        {badgeIcons[suitability]}
        {suitability.replace('-', ' ')}
    </Badge>
  );
}


export function ListingCard({ listing, category, isLoading }: ListingCardProps) {
  const { savedListingIds, toggleSaveListing } = useSavedListings();
  
  const isSaved = savedListingIds.has(listing.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveListing(listing.id);
  }

  return (
    <Link href={`/listing/${listing.id}`} className="block h-full">
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0 relative">
            <Image
            src={listing.image}
            alt={listing.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="apartment room"
            />
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2 mb-2">
                {isLoading ? <Skeleton className="h-5 w-32" /> : category && <SuitabilityBadge suitability={category.suitability} />}
            </div>
            <CardTitle className="text-lg font-headline font-semibold mb-1 leading-tight">{listing.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{listing.location.address}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5" title={`${listing.details.bedrooms} bedrooms`}>
                <BedDouble className="h-4 w-4" />
                <span>{listing.details.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${listing.details.bathrooms} bathrooms`}>
                <Bath className="h-4 w-4" />
                <span>{listing.details.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${listing.details.area} m²`}>
                <Ruler className="h-4 w-4" />
                <span>{listing.details.area} m²</span>
            </div>
            </div>
            <div className="text-xs text-muted-foreground italic flex-1">
                {isLoading ? (
                <div className="space-y-1.5">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-5/6" />
                </div>
                ) : category?.reason}
            </div>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
            <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <Button size="icon" variant="ghost" onClick={handleSaveClick} aria-label={isSaved ? "Unsave listing" : "Save listing"}>
            <Heart className={cn("h-5 w-5", isSaved && "fill-destructive text-destructive")} />
            </Button>
        </CardFooter>
        </Card>
    </Link>
  );
}
