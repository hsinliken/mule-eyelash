import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appointment } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

interface BookingContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
}

const BookingContext = createContext<BookingContextType>({
  appointments: [],
  addAppointment: async () => { },
  updateAppointmentStatus: async () => { },
});

export const useBookings = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // 監聽 Firestore 的 bookings 集合
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apts: Appointment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));

      // Client-side sort by time for same-day items since we can't easily do double-sort in Firestore without index
      apts.sort((a, b) => {
        if (a.date !== b.date) return 0; // Already sorted by date desc by Firestore
        return a.time.localeCompare(b.time);
      });

      setAppointments(apts);
    });

    return () => unsubscribe();
  }, []);

  const addAppointment = async (aptData: Omit<Appointment, 'id' | 'status'>) => {
    try {
      // Remove undefined fields to prevent Firestore errors
      const safeData = JSON.parse(JSON.stringify(aptData));

      await addDoc(collection(db, 'bookings'), {
        ...safeData,
        status: 'pending', // 預設為待確認
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding appointment: ", e);
      alert("預約發送失敗，請檢查網路或是聯繫商家。");
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const aptRef = doc(db, 'bookings', id);
      await updateDoc(aptRef, { status });
    } catch (e) {
      console.error("Error updating status: ", e);
      alert("更新狀態失敗");
    }
  };

  return (
    <BookingContext.Provider value={{ appointments, addAppointment, updateAppointmentStatus }}>
      {children}
    </BookingContext.Provider>
  );
};
