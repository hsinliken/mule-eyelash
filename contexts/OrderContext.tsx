import React, { createContext, useContext, useState } from 'react';
import { Order, OrderStatus } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: OrderStatus, trackingNumber?: string) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  createOrder: () => '',
  updateOrderStatus: () => {},
  updateOrder: () => {},
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    // Mock initial order
    {
      id: 'ord_mock_1',
      items: [
        {
           id: 'p1',
           name: 'Mule Lash Serum',
           price: 1280,
           description: 'Nourish your natural lashes...',
           image: 'https://picsum.photos/id/21/500/500',
           inStock: true,
           quantity: 1
        }
      ],
      totalAmount: 1280,
      customer: {
        name: 'Sarah Chen',
        phone: '0912345678',
        email: 'sarah@example.com'
      },
      delivery: {
        method: 'home_delivery',
        address: 'Taipei City, Xinyi Dist...',
        trackingNumber: 'TW123456789'
      },
      payment: {
        method: 'credit_card',
        isPaid: true
      },
      status: 'shipped',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `ord_${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'pending', // Default status
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newId; // Return the ID so Checkout page can show it
  };

  const updateOrderStatus = (id: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status,
          delivery: trackingNumber ? { ...order.delivery, trackingNumber } : order.delivery
        };
      }
      return order;
    }));
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};