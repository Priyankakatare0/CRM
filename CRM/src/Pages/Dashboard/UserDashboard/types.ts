export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type Role = 'admin' | 'user' | 'manager' | 'editor';