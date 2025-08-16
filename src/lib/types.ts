export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number; 
    petsAllowed: boolean;
    couplesAllowed: boolean;
    furnishing: 'furnished' | 'unfurnished' | 'semi-furnished';
    registrationPossible: boolean;
    energyLabel: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Unknown';
    amenities: string[];
  };
  image: string;
  type: 'Apartment' | 'House' | 'Studio';
  sourceUrl: string;
};

export type School = {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type Suitability = 'all' | 'student-friendly' | 'long-term resident' | 'unsuitable';

export type FiltersState = {
    priceRange: number[];
    sortBy: string;
    suitability: Suitability;
    selectedSchool: School | null;
}
