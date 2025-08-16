import type { Listing } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface MapViewProps {
    listings: Listing[];
}

export function MapView({ listings }: MapViewProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative w-full h-64 md:h-80 lg:h-96">
                <Image
                    src="https://placehold.co/1200x800.png"
                    alt="Map of Leeuwarden"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="city map"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white p-4 bg-black/50 rounded-lg">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="text-lg font-bold">Interactive Map View</h3>
                        <p className="text-sm">Map functionality will be available here.</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
