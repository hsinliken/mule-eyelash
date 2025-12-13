import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: async () => { },
  updateProduct: async () => { },
  deleteProduct: async () => { },
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 監聽 products 集合
    const q = query(collection(db, 'products'), orderBy('price', 'desc')); // 簡單排序
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // [Auto-Seed] 如果資料庫是空的，自動寫入預設資料
        console.log('Seeding initial products...');
        for (const p of INITIAL_PRODUCTS) {
          // 注意：INITIAL_PRODUCTS 裡的 id (如 p1, p2) 在這裡會被 Firestore 自動 ID 取代
          // 或是我們可以使用 setDoc 指定 ID。這裡為了簡單用 addDoc
          const { id, ...data } = p;
          await addDoc(collection(db, 'products'), data);
        }
        return;
      }

      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(items);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), productData);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), updates);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
