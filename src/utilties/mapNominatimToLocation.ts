import type { V1LocationData } from "@omnsight/clients/dist/geovision/geovision";

const getFirst = (obj: any, keys: string[]) => {
  for (const key of keys) {
    if (obj[key]) return obj[key];
  }
  return undefined;
};

export const mapNominatimToLocation = (raw: any): V1LocationData => {
  const { lat, lon, address, display_name } = raw;

  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    countryCode: address.country_code?.toUpperCase(),

    // 1. ADMINISTRATIVE AREA (State / Province / Region)
    // Checks for: State (US), Prefecture (Japan), Province (Canada/China), Region (Europe)
    administrativeArea: getFirst(address, [
      'state',
      'province',
      'prefecture',
      'region',
      'state_district'
    ]),

    // 2. SUB-ADMINISTRATIVE AREA (County / District)
    // Checks for: County (US/UK), District (India), Department (France/South America)
    subAdministrativeArea: getFirst(address, [
      'county',
      'district',
      'department',
      'municipality'
    ]),

    // 3. LOCALITY (City / Town)
    // Checks standard hierarchy
    locality: getFirst(address, [
      'city',
      'town',
      'village',
      'hamlet',
      'city_district'
    ]),

    // 4. SUB-LOCALITY (Neighborhood / Ward)
    // Critical for large Asian cities (e.g., Shibuya-ku in Tokyo)
    subLocality: getFirst(address, [
      'suburb',
      'neighbourhood',
      'quarter',
      'ward',       // Common in Japan
      'residential'
    ]),

    address: display_name,

    // WARNING: Your interface defines postalCode as 'number'.
    // Many countries (UK, Canada, Netherlands, Argentina) use letters (e.g., "SW1A 1AA").
    // This parser tries to extract numbers, but for global support, 
    // you should really change your interface to 'string'.
    postalCode: address.postcode
      ? parseInt(address.postcode.replace(/\D/g, ''), 10)
      : undefined
  };
};