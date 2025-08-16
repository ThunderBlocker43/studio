import { Header } from '@/components/header';
import { allListings } from '@/data/listings';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bath, BedDouble, Dog, ExternalLink, MapPin, Ruler, Users } from 'lucide-react';
import { formatPrice, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';
import { SingleListingMap } from '@/components/single-listing-map';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function ListingPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params);
  const listing = allListings.find(l => generateSlug(l.location.address) === id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-8">
                <Image
                src={listing.image}
                alt={listing.title}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                data-ai-hint="apartment room"
                />
            </Card>
             <Card>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{listing.type}</Badge>
                    <CardTitle className="text-3xl font-headline">{listing.title}</CardTitle>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                        <MapPin className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{listing.location.address}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Details</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-md text-foreground">
                            <div className="flex items-center gap-2" title={`${listing.details.bedrooms} bedrooms`}>
                                <BedDouble className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <span className='font-semibold'>{listing.details.bedrooms}</span>
                                    <span className="text-muted-foreground ml-1">beds</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" title={`${listing.details.bathrooms} bathrooms`}>
                                <Bath className="h-5 w-5 text-muted-foreground" />
                                 <div>
                                    <span className='font-semibold'>{listing.details.bathrooms}</span>
                                    <span className="text-muted-foreground ml-1">baths</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" title={`${listing.details.area} m²`}>
                                <Ruler className="h-5 w-5 text-muted-foreground" />
                                 <div>
                                    <span className='font-semibold'>{listing.details.area}</span>
                                    <span className="text-muted-foreground ml-1">m²</span>
                                </div>
                            </div>
                             <div className="flex items-center gap-2" title={listing.details.petsAllowed ? 'Pets are allowed' : 'Pets are not allowed'}>
                                <Dog className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <span className='font-semibold'>{listing.details.petsAllowed ? 'Yes' : 'No'}</span>
                                    <span className="text-muted-foreground ml-1">pets</span>
                                </div>
                            </div>
                             <div className="flex items-center gap-2" title={listing.details.couplesAllowed ? 'Couples are allowed' : 'Couples are not allowed'}>
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <span className='font-semibold'>{listing.details.couplesAllowed ? 'Yes' : 'No'}</span>
                                    <span className="text-muted-foreground ml-1">couples</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Separator />

                    <div>
                         <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-foreground/80">{listing.description}</p>
                    </div>

                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardContent className="p-6">
                     <div className='flex justify-between items-center mb-6'>
                        <div>
                            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
                            <p className="text-sm font-normal text-muted-foreground">/month</p>
                        </div>
                         <Button size="lg" asChild>
                            <Link href={listing.sourceUrl} target="_blank">
                                View Original Listing
                                <ExternalLink className="ml-2 h-4 w-4"/>
                            </Link>
                         </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                        This is a listing aggregated from an external website. Click the button to view the original post and contact the landlord.
                    </p>
                </CardContent>
            </Card>
            <Card className='h-80'>
              <SingleListingMap listing={listing} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
