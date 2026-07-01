export type UserRole =
  | "citizen"
  | "reception_staff"
  | "doctor"
  | "pharmacist"
  | "district_admin"
  | "super_admin";

export interface UserProfile {
  id: string;
  mobile_number: string;
  country_code: string;
  full_name: string | null;
  email: string | null;
  language: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  is_verified: boolean;
  profile_completion_percent: number;
  created_at: string;
  last_login: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  is_new_user: boolean;
  user: UserProfile;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AccessTokenClaims {
  sub: string;
  role: UserRole;
  sid: string;
  ver: number;
  iat: number;
  exp: number;
  type: "access";
}

export interface ApiErrorBody {
  error_code: string;
  message: string | Array<{ msg?: string; [key: string]: unknown }>;
}
