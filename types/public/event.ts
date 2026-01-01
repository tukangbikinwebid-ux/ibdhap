// Tipe Data untuk Event
export interface Event {
  id: number;
  title: string;
  organizer: string;
  description: string | null;
  start_date: string; // ISO Date String
  end_date: string; // ISO Date String
  location: string;
  is_online: number; // 0 = offline, 1 = online
  registration_link: string;
  created_at: string;
  updated_at: string;
  image: string;
}

// Params untuk Get Event List
export interface GetEventsParams {
  page?: number;
  paginate?: number;
}