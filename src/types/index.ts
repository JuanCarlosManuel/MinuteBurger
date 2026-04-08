export interface MenuItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface CartItemProps {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
