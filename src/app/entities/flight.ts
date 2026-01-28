export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  airline: {
    name: string;
    code: string;
  }
}

