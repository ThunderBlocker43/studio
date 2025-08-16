import { Wifi, WashingMachine, Snowflake, ParkingSquare, Tv, Sofa, Wind, Sun, Flower, Utensils, Check, X, Building, Car, GitCommit, Waves, Elevator, Share2 } from 'lucide-react';

interface AmenityIconProps {
    amenity: string;
    className?: string;
}

export const AmenityIcon = ({ amenity, className }: AmenityIconProps) => {
    switch (amenity.toLowerCase()) {
        case 'wifi':
            return <Wifi className={className} />;
        case 'washing machine':
            return <WashingMachine className={className} />;
        case 'air conditioning':
            return <Snowflake className={className} />;
        case 'parking':
            return <ParkingSquare className={className} />;
        case 'tv':
            return <Tv className={className} />;
        case 'furnished':
            return <Sofa className={className} />;
        case 'balcony':
            return <Building className={className} />;
        case 'garden':
            return <Flower className={className} />;
        case 'dishwasher':
            return <Waves className={className} />;
        case 'elevator':
            return <Elevator className={className} />;
        case 'shared kitchen':
            return <Share2 className={className} />;
        default:
            return <Check className={className} />;
    }
}
