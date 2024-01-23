export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
}

export function createFlight(): Flight {
  return {
    id: 1,
    from: 'Wien',
    to: 'Berlin',
    date: '2024-01-23',
    delayed: true,
  };
}
