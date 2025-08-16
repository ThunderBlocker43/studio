import { Header } from '@/components/header';
import { allListings } from '@/data/listings';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { formatPrice, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';

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
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card className="overflow-hidden">
                <Image
                src={listing.image}
                alt={listing.title}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                data-ai-hint="apartment room"
                />
            </Card>
          </div>
          <div>
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
                        <h3 className="text-xl font-semibold mb-2">Details</h3>
                        <div className="flex items-center space-x-6 text-md text-foreground">
                        <div className="flex items-center gap-2" title={`${listing.details.bedrooms} bedrooms`}>
                            <BedDouble className="h-5 w-5 text-muted-foreground" />
                            <span className='font-semibold'>{listing.details.bedrooms}</span>
                            <span className="text-muted-foreground">beds</span>
                        </div>
                        <div className="flex items-center gap-2" title={`${listing.details.bathrooms} bathrooms`}>
                            <Bath className="h-5 w-5 text-muted-foreground" />
                            <span className='font-semibold'>{listing.details.bathrooms}</span>
                            <span className="text-muted-foreground">baths</span>
                        </div>
                        <div className="flex items-center gap-2" title={`${listing.details.area} m²`}>
                            <Ruler className="h-5 w-5 text-muted-foreground" />
                            <span className='font-semibold'>{listing.details.area}</span>
                            <span className="text-muted-foreground">m²</span>
                        </div>
                        </div>
                    </div>

                    <div>
                         <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-foreground/80">{listing.description}</p>
                    </div>

                    <div className='flex justify-between items-center bg-secondary/50 p-4 rounded-lg'>
                        <div>
                            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
                            <p className="text-sm font-normal text-muted-foreground">/month</p>
                        </div>
                         <Button size="lg">Contact Landlord</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
