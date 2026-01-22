// types/public/places.ts

export interface PlaceTranslation {
  id: number;
  place_id: number;
  locale: string; // 'en', 'id', 'ar', 'fr', 'kr', 'jp'
  name: string;
  description: string; // HTML Content
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: number;
  name: string; // Default Name
  address: string; // HTML Content
  description: string; // HTML Content
  latitude: string;
  longitude: string;
  type: string; // e.g., 'restaurant', 'masjid', 'school'
  rating: string;
  facilities: string[];
  created_at: string;
  updated_at: string;
  distance: number;
  image: string;
  translations: PlaceTranslation[];
}

export interface GetPlacesParams {
  latitude: number | string;
  longitude: number | string;
  radius: number; // Dalam kilometer atau meter (tergantung backend)
}

export interface PlacesResponse {
  code: number;
  message: string;
  data: Place[];
}