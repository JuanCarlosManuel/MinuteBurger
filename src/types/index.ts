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

export interface OrderItemProps extends CartItemProps {}

export interface OrderProps {
  id: string;
  timestamp: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItemProps[];
  total: number;
  status: 'pending' | 'preparing' | 'completed';
}
