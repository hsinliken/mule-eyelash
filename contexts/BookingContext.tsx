import React, { createContext, useContext, useState } from 'react';
import { Appointment } from '../types';

interface BookingContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
}

const BookingContext = createContext<BookingContextType>({
  appointments: [],
  addAppointment: () => {},
  updateAppointmentStatus: () => {},
});

export const useBookings = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock initial data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt_mock_1',
      serviceId: 's2',
      stylistId: 'st1',
      date: '2023-10-12',
      time: '14:30',
      status: 'completed'
    }
  ]);

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      status: 'confirmed', // In a real app, might start as 'pending'
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status } : apt)
    );
  };

  return (
    <BookingContext.Provider value={{ appointments, addAppointment, updateAppointmentStatus }}>
      {children}
    </BookingContext.Provider>
  );
};
