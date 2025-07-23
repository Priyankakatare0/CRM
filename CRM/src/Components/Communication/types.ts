export interface Communication {
  id: number;
  type: 'email' | 'call';
  subject: string;
  content: string;
  sender?: string;
  recipient?: string;
  participant?: string;
  duration?: string;
  timestamp: string;
  status: string;
}