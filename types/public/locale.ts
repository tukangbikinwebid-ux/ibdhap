export interface Locale {
  id: number;
  code: string;
  name: string;
  direction: "ltr" | "rtl";
  created_at: string;
  updated_at: string;
}

export interface LocaleResponse {
  code: number;
  message: string;
  data: Locale[];
}
