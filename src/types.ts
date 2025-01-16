
export interface Ride {
  id: string;
  name: string;
  price: number;
}

export interface Info {
  title: string;
  description: string;
  illustration: string;
  action?: () => void;
}