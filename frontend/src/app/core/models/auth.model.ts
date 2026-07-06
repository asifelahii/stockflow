export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  organization_name: string;
  email: string;
  password: string;
  turnstile_token?: string;
}

export interface OrganizationSummary {
  id: number;
  name: string;
  role: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  organization: OrganizationSummary;
}

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OAuthProvider = 'google' | 'facebook' | 'apple';

export interface OAuthProvidersResponse {
  google: boolean;
  facebook: boolean;
  apple: boolean;
}

