export interface PolicySection {
  title: string;
  content: string;
}

export interface PrivacyPolicyContent {
  lastUpdated: string;
  sections: PolicySection[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
