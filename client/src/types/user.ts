export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions?: Record<string, boolean>;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'editor' | 'viewer';
  permissions?: Record<string, boolean>;
}