import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, this initial state would come from an API (Firebase/Google Sheets)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`, // Generate a temporary ID
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
