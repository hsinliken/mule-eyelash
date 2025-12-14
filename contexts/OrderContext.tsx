import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, setDoc } from 'firebase/firestore';

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (id: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  createOrder: async () => '',
  updateOrderStatus: async () => { },
  updateOrder: async () => { },
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Subscribe to Orders from Firestore
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(loadedOrders);
    });
    return () => unsubscribe();
  }, []);

  // 2. Create Order (Add to Firestore)
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    // We let Firestore generate the ID, or we can create a custom one. 
    // For simplicity, let's use addDoc which auto-generates IDs, 
    // but the user's previous code generated a custom ID. 
    // Use Firestore auto-ID to be safe, or setDoc with custom ID.
    // Let's stick to the previous ID format `ord_timestamp` for readability, but use setDoc.

    const newId = `ord_${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const orderRef = doc(db, 'orders', newId);
    await setDoc(orderRef, newOrder);
    return newId;
  };

  // 3. Update Order Status
  const updateOrderStatus = async (id: string, status: OrderStatus, trackingNumber?: string) => {
    const orderRef = doc(db, 'orders', id);
    const updates: any = { status };
    if (trackingNumber) {
      // Logic to merge into delivery object requires reading first or dot notation if structured well
      // Simple approach: we just update status here mostly.
      // If we need to update nested fields like 'delivery.trackingNumber', dot notation works:
      updates['delivery.trackingNumber'] = trackingNumber;
    }
    await updateDoc(orderRef, updates);
  };

  // 4. Update Generic Order Fields
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, updates);
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};