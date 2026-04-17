export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  heroImage: string;
  story: string;
  mission: string;
  vision: string;
  values: string[];
  stats: AboutStat[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
