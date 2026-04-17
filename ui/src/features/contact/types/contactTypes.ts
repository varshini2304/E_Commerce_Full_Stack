export interface ContactSocialLink {
  id: string;
  label: string;
  href: string;
}

export interface ContactInfo {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  socialLinks: ContactSocialLink[];
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactSubmissionResult {
  ticketId: string;
  submittedAt: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
