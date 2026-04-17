export interface TermsSection {
  title: string;
  content: string;
}

export interface TermsContent {
  lastUpdated: string;
  sections: TermsSection[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
