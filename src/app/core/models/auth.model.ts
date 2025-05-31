export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  username: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}