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

export interface Customer {
  id: string;
  name: string;
  joiningDate: string;
  salary: number;
}

export interface Filter {
  field: 'name' | 'joiningDate' | 'salary';
  operator: 'greaterThan' | 'lessThan';
  value: string | number;
}

export interface Report {
  name: string;
  filters: Filter[];
}
