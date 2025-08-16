
'use client';

import type { Listing } from "@/lib/types";
import { GoogleMap, LoadScript, MarkerF, InfoWindowF, OverlayView } from '@react-google-maps/api';
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

const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
});

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
                           <OverlayView
                                key={listing.id}
                                position={{ lat: listing.location.lat, lng: listing.location.lng }}
                                mapPaneName={activeMarker === listing.id ? OverlayView.FLOAT_PANE : OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={getPixelPositionOffset}
                           >
                               <button 
                                    className="px-3 py-1 text-sm font-bold text-primary-foreground bg-primary rounded-full shadow-lg border-2 border-white transition-transform duration-200 ease-in-out hover:scale-110 focus:scale-110 focus:outline-none"
                                    onClick={() => handleMarkerClick(listing)}
                                    onMouseOver={() => handleMarkerMouseOver(listing.id)}
                                    onMouseOut={handleMarkerMouseOut}
                                    style={{
                                        transform: activeMarker === listing.id ? 'scale(1.1)' : 'scale(1)',
                                    }}
                               >
                                    {formatPrice(listing.price)}
                                    {activeMarker === listing.id && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs">
                                            <div className="bg-card text-card-foreground p-2 rounded-lg shadow-xl">
                                                <h4 className="font-bold text-sm">{listing.title}</h4>
                                            </div>
                                        </div>
                                    )}
                               </button>
                           </OverlayView>
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </Card>
    );
}
