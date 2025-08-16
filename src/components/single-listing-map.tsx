
'use client';

import type { Listing } from "@/lib/types";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { Card } from "@/components/ui/card";

interface SingleListingMapProps {
    listing: Listing;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export function SingleListingMap({ listing }: SingleListingMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
             <div className="h-full bg-muted flex items-center justify-center rounded-lg">
                <div className="text-center text-foreground p-4">
                    <h3 className="text-md font-bold">Map Not Configured</h3>
                    <p className="text-xs">Please provide a Google Maps API key.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full">
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: listing.location.lat, lng: listing.location.lng }}
                    zoom={15}
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
                    <MarkerF position={{ lat: listing.location.lat, lng: listing.location.lng }} />
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
