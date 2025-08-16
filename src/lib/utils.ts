import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export function generateSlug(address: string): string {
    const parts = address.split(',');
    if (parts.length < 2) return '';

    const streetAndNumber = parts[0].trim();
    const postcodePart = parts[1].trim();

    const numberMatch = streetAndNumber.match(/\d+[a-zA-Z]*$/);
    const houseNumber = numberMatch ? numberMatch[0] : '';

    const postcodeMatch = postcodePart.match(/\d{4}\s?[a-zA-Z]{2}/);
    const postcode = postcodeMatch ? postcodeMatch[0].replace(/\s/g, '').toLowerCase() : '';

    if (postcode && houseNumber) {
        return `${postcode}-${houseNumber}`;
    }
    return '';
}
