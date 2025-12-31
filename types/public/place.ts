export interface Place {
  id: number;
  name: string;
  address: string;
  description: string;
  latitude: string;
  longitude: string;
  type: string;
  rating: string;
  facilities: string[];
  created_at: string;
  updated_at: string;
  distance: number;
  image: string;
}

export interface GetPlacesParams {
  latitude: number;
  longitude: number;
  radius: number;
}

// Interface untuk response wrapper standar API Anda
export interface PlacesResponse {
  code: number;
  message: string;
  data: Place[];
}