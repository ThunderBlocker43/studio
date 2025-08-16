
'use client';

import type { Listing } from "@/lib/types";
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { generateSlug, formatPrice } from "@/lib/utils";
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

    const handleMarkerClick = (listing: Listing) => {
        router.push(`/listing/${generateSlug(listing.location.address)}`);
    };

    const handleMarkerMouseOver = (listingId: string) => {
        setActiveMarker(listingId);
    };

    const handleMarkerMouseOut = () => {
        setActiveMarker(null);
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
                                onClick={() => handleMarkerClick(listing)}
                                onMouseOver={() => handleMarkerMouseOver(listing.id)}
                                onMouseOut={handleMarkerMouseOut}
                                zIndex={activeMarker === listing.id ? 10 : 1}
                            >
                                {activeMarker === listing.id && (
                                    <InfoWindowF
                                        onCloseClick={handleMarkerMouseOut}
                                        options={{
                                            pixelOffset: new window.google.maps.Size(0, -35),
                                            disableAutoPan: true,
                                        }}
                                    >
                                        <div className="p-1">
                                            <h4 className="font-bold text-sm mb-1">{listing.title}</h4>
                                        </div>
                                    </InfoWindowF>
                                )}
                            </MarkerF>
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </Card>
    );
}
