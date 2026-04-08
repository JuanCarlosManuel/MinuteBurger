"use client";

import { CartItemProps, OrderProps } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ContextProps {
  cart: CartItemProps[];
  setCart: Dispatch<SetStateAction<CartItemProps[]>>;
  updateCart: (newCart: CartItemProps[]) => void;
  orders: OrderProps[];
  addOrder: (order: OrderProps) => void;
  updateOrderStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
}

const GlobalContext = createContext<ContextProps>({
  cart: [],
  setCart: (): CartItemProps[] => [],
  updateCart(newCart: CartItemProps[]) {},
  orders: [],
  addOrder(order: OrderProps) {},
  updateOrderStatus(orderId: string, status) {},
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let parsedCart: [] | CartItemProps[] = [];
  let parsedOrders: OrderProps[] = [];

  const [cart, setCart] = useState<[] | CartItemProps[]>([]);
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const updateCart = (newCart: CartItemProps[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addOrder = (order: OrderProps) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'preparing' | 'completed') => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let storedCart = localStorage.getItem("cart");
      let storedOrders = localStorage.getItem("orders");

      if (storedCart) {
        parsedCart = JSON.parse(storedCart);
      }
      if (storedOrders) {
        parsedOrders = JSON.parse(storedOrders);
      }
      setCart(parsedCart);
      setOrders(parsedOrders);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ cart, setCart, updateCart, orders, addOrder, updateOrderStatus }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
