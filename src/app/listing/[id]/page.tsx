import { Header } from '@/components/header';
import { allListings } from '@/data/listings';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Bath, BedDouble, Dog, ExternalLink, MapPin, Ruler, Users, 
    Sofa, ClipboardSignature, Leaf, PiggyBank, FileText
} from 'lucide-react';
import { formatPrice, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';
import { SingleListingMap } from '@/components/single-listing-map';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { AmenityIcon } from '@/components/amenity-icon';

export default function ListingPage({ params }: { params: { id:string } }) {
  const { id } = React.use(params);
  const listing = allListings.find(l => generateSlug(l.location.address) === id);

  if (!listing) {
    notFound();
  }

  const PriceAndDeposit = () => (
    <div className='space-y-2'>
        <div>
            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
            <p className="text-sm font-normal text-muted-foreground">/month (excl. utilities)</p>
        </div>
        {listing.details.deposit && (
             <div className='flex items-center gap-2 text-sm'>
                <PiggyBank className="h-4 w-4 text-muted-foreground"/>
                <span className='text-muted-foreground'>Deposit:</span>
                <span className="font-medium text-foreground">
                    {formatPrice(listing.details.deposit)}
                </span>
            </div>
        )}
    </div>
  );

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
            
            <div className='p-4 -mt-8 bg-background rounded-lg shadow-md mb-8 lg:hidden'>
                 <PriceAndDeposit />
            </div>

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
                        <h3 className="text-xl font-semibold mb-4">Key Details</h3>
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
                            <div className="flex items-center gap-2" title={`Furnishing: ${listing.details.furnishing}`}>
                                <Sofa className="h-5 w-5 text-muted-foreground" />
                                <span className='font-semibold capitalize'>{listing.details.furnishing}</span>
                            </div>
                             <div className="flex items-center gap-2" title={`Registration possible: ${listing.details.registrationPossible ? 'Yes' : 'No'}`}>
                                <ClipboardSignature className="h-5 w-5 text-muted-foreground" />
                                <span className='font-semibold'>{listing.details.registrationPossible ? 'Yes' : 'No'}</span>
                            </div>
                             <div className="flex items-center gap-2" title={`Energy Label: ${listing.details.energyLabel}`}>
                                <Leaf className="h-5 w-5 text-muted-foreground" />
                                <span className='font-semibold'>{listing.details.energyLabel}</span>
                            </div>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-md text-foreground">
                            {listing.details.amenities.map(amenity => (
                                <div key={amenity} className="flex items-center gap-2">
                                    <AmenityIcon amenity={amenity} className="h-5 w-5 text-muted-foreground" />
                                    <span className="capitalize">{amenity}</span>
                                </div>
                            ))}
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
                <CardContent className="p-6 space-y-4">
                     <div className='hidden lg:block'>
                        <PriceAndDeposit />
                    </div>
                    <Separator className='hidden lg:block'/>
                     <div className="space-y-3">
                        <h4 className="font-semibold text-md">Additional Costs</h4>
                        <div className='flex items-center justify-between text-sm'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <FileText className="h-4 w-4"/>
                                <span>Administration Fee</span>
                            </div>
                             <span className="font-medium text-foreground">
                                {listing.details.administrationFee ? formatPrice(listing.details.administrationFee) : 'None'}
                            </span>
                        </div>
                     </div>
                     <Separator />
                     <div>
                         <Button size="lg" asChild className='w-full'>
                            <Link href={listing.sourceUrl} target="_blank">
                                View Original Listing
                                <ExternalLink className="ml-2 h-4 w-4"/>
                            </Link>
                         </Button>
                        <p className='text-xs text-muted-foreground mt-3 text-center'>
                            This is an aggregated listing. View the original post to contact the landlord.
                        </p>
                    </div>
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
