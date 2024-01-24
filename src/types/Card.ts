
export type Card = {
  id?: string | number;
  isGettingCreated?: boolean;
  screen: string;
  title: string;
  image?: any;
  imageUrl?: string;
  data: any;
  error?: boolean;
}