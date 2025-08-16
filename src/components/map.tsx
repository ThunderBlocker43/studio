'use client';

import type { Listing } from "@/lib/types";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { generateSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";


interface MapViewProps {
    listings: Listing[];
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 53.201,
  lng: 5.795
};

export function MapView({ listings }: MapViewProps) {
    const router = useRouter();
    const [activeMarker, setActiveMarker] = useState<string | null>(null);

    const handleMarkerClick = (listingId: string) => {
        router.push(`/listing/${generateSlug(listings.find(l => l.id === listingId)!.location.address)}`);
    };
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
             <Card className="overflow-hidden">
                <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted flex items-center justify-center">
                    <div className="text-center text-foreground p-4 bg-background/50 rounded-lg">
                        <h3 className="text-lg font-bold">Map Not Configured</h3>
                        <p className="text-sm">Please provide a Google Maps API key.</p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden">
            <div className="relative w-full h-64 md:h-80 lg:h-96">
                <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13}
                        options={{ 
                            disableDefaultUI: true, 
                            zoomControl: true,
                            styles: [
                                {
                                    "featureType": "poi",
                                    "stylers": [ { "visibility": "off" } ]
                                }
                            ]
                        }}
                    >
                        {listings.map((listing) => (
                            <MarkerF
                                key={listing.id}
                                position={{ lat: listing.location.lat, lng: listing.location.lng }}
                                onClick={() => handleMarkerClick(listing.id)}
                                onMouseOver={() => setActiveMarker(listing.id)}
                                onMouseOut={() => setActiveMarker(null)}
                                zIndex={activeMarker === listing.id ? 10 : 1}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </Card>
    );
}