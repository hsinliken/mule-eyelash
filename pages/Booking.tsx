import React, { useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { ChevronRight, Clock, Star, Check, AlertCircle } from 'lucide-react';
import { Service, Stylist } from '../types';
import { useLiff } from '../contexts/LiffContext';
import { useBookings } from '../contexts/BookingContext';
import { useStylists } from '../contexts/StylistContext';

enum BookingStep {
  SERVICE = 0,
  STYLIST = 1,
  DATETIME = 2,
  CONFIRM = 3
}

const Booking: React.FC = () => {
  const { liffObject, isLoggedIn } = useLiff();
  const { addAppointment } = useBookings();
  const { stylists } = useStylists();
  
  const [step, setStep] = useState<BookingStep>(BookingStep.SERVICE);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [generatedTimes, setGeneratedTimes] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter stylists who can perform the selected service
  const availableStylists = stylists.filter(s => 
    selectedService && s.specialties.includes(selectedService.category)
  );

  // Generate available times based on stylist schedule and selected date
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      const dayOfWeek = new Date(selectedDate).getDay(); // 0=Sun, 1=Mon...
      
      // Check if stylist works on this day
      if (!selectedStylist.workDays.includes(dayOfWeek)) {
        setGeneratedTimes([]);
        return;
      }

      // Generate slots every 30 mins between start and end time
      const times: string[] = [];
      let [startH, startM] = selectedStylist.workHours.start.split(':').map(Number);
      const [endH, endM] = selectedStylist.workHours.end.split(':').map(Number);
      
      let currentH = startH;
      let currentM = startM;

      while (currentH < endH || (currentH === endH && currentM < endM)) {
        const timeStr = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;
        times.push(timeStr);
        
        currentM += 90; // Suggesting 90 min slots roughly, or standard 30 min intervals
        // Let's do 90 mins for better realistic booking or 30 mins choices? 
        // Let's stick to 1.5 hour slots or 1 hour slots for simplicity, or just 30min intervals user picks start time.
        // Reverting to 30 min intervals for flexibility.
        currentM -= 60; // Reset logic for simple loop
        
        // Simple loop for 30 min intervals
        currentM += 30;
        if (currentM >= 60) {
          currentH++;
          currentM -= 60;
        }
      }
      // Re-generate properly
      const slots = [];
      let h = startH; 
      let m = startM;
      const endTotalMins = endH * 60 + endM;
      
      // Prevent booking too close to closing time (service duration)
      const serviceDuration = selectedService?.duration || 60;
      
      while ((h * 60 + m) + serviceDuration <= endTotalMins) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        m += 30;
        if (m >= 60) { h++; m = 0; }
      }
      
      setGeneratedTimes(slots);
    }
  }, [selectedDate, selectedStylist, selectedService]);

  const handleNext = () => {
    if (step < BookingStep.CONFIRM) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > BookingStep.SERVICE) {
      setStep(prev => prev - 1);
      // Reset dependent fields
      if (step === BookingStep.STYLIST) setSelectedStylist(null);
      if (step === BookingStep.DATETIME) { setSelectedDate(''); setSelectedTime(''); }
    }
  };

  const submitBooking = async () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    addAppointment({
      serviceId: selectedService.id,
      stylistId: selectedStylist.id,
      date: selectedDate,
      time: selectedTime,
    });

    if (liffObject && isLoggedIn && liffObject.isInClient()) {
      try {
        await liffObject.sendMessages([
          {
            type: 'text',
            text: `📅 新預約申請 (New Booking)\n\n項目: ${selectedService.title}\n美睫師: ${selectedStylist.name}\n日期: ${selectedDate}\n時間: ${selectedTime}\n\n請商家回覆以確認預約。`
          }
        ]);
      } catch (error) {
        console.error('Error sending LINE message', error);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-light text-brand-900 mb-2">預約申請已送出</h2>
        <p className="text-brand-500 mb-8 text-sm">
          我們已將詳細資訊發送至 LINE 聊天室。<br/>
          請等待商家回覆「確認」以完成預約。
        </p>
        <button onClick={() => window.location.hash = '/'} className="w-full bg-brand-800 text-white py-4 rounded-xl font-medium tracking-wide shadow-lg shadow-brand-200">返回首頁</button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-brand-50/50">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={`w-full h-1 rounded-full mb-2 ${i <= step ? 'bg-brand-600' : 'bg-brand-200'}`} />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-light text-brand-900">
          {step === BookingStep.SERVICE && "選擇服務項目"}
          {step === BookingStep.STYLIST && "選擇美容師"}
          {step === BookingStep.DATETIME && "選擇預約時間"}
          {step === BookingStep.CONFIRM && "確認預約資訊"}
        </h1>
        <p className="text-brand-500 text-sm mt-1">
          {step === BookingStep.SERVICE && "選擇最適合您的美容療程"}
          {step === BookingStep.STYLIST && "為您篩選具備該專長的美容師"}
          {step === BookingStep.DATETIME && "選擇您方便的時段"}
        </p>
      </div>

      {/* Step 1: Service Selection */}
      {step === BookingStep.SERVICE && (
        <div className="grid gap-4">
          {SERVICES.map(service => (
            <div 
              key={service.id}
              onClick={() => { setSelectedService(service); handleNext(); }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-100 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="h-40 overflow-hidden relative">
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                 <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-brand-800">
                   ${service.price}
                 </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-brand-900">{service.title}</h3>
                  <div className="flex items-center text-brand-500 text-xs mt-1">
                    <span className="bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded mr-2">
                      {service.category === 'Lash' ? '美睫' : service.category === 'Brow' ? '美眉' : service.category === 'Lip' ? '美唇' : '保養'}
                    </span>
                    <Clock size={12} className="mr-1" /> {service.duration} 分鐘
                  </div>
                </div>
                <ChevronRight className="text-brand-300" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Stylist Selection */}
      {step === BookingStep.STYLIST && (
        <div className="grid gap-4">
           {availableStylists.length === 0 ? (
             <div className="text-center py-10 text-brand-400">
               目前沒有可提供此服務的美容師。
             </div>
           ) : (
             availableStylists.map(stylist => (
               <div 
                  key={stylist.id}
                  onClick={() => { setSelectedStylist(stylist); handleNext(); }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-brand-100 flex items-center gap-4 active:bg-brand-50 cursor-pointer"
               >
                  <img src={stylist.image} alt={stylist.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-100" />
                  <div className="flex-1">
                    <h3 className="font-medium text-brand-900 text-lg">{stylist.name}</h3>
                    <p className="text-brand-500 text-xs uppercase tracking-wider">{stylist.role}</p>
                    <div className="flex items-center mt-1 text-brand-600 text-sm">
                      <Star size={14} fill="currentColor" className="mr-1" />
                      {stylist.rating}
                    </div>
                  </div>
                  <ChevronRight className="text-brand-300" />
               </div>
             ))
           )}
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === BookingStep.DATETIME && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
           <div className="mb-6">
             <label className="block text-sm font-medium text-brand-700 mb-2">日期</label>
             <input 
               type="date" 
               className="w-full p-3 bg-brand-50 rounded-xl border-none text-brand-900 focus:ring-2 focus:ring-brand-300 outline-none"
               onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
             />
             {selectedDate && new Date(selectedDate).getDay() !== undefined && selectedStylist && !selectedStylist.workDays.includes(new Date(selectedDate).getDay()) && (
               <p className="text-red-400 text-xs mt-2">該美容師今日未排班，請選擇其他日期。</p>
             )}
           </div>
           
           {selectedDate && generatedTimes.length > 0 && (
             <div className="animate-fade-in">
               <label className="block text-sm font-medium text-brand-700 mb-2">可預約時段</label>
               <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto no-scrollbar">
                 {generatedTimes.map(time => (
                   <button
                     key={time}
                     onClick={() => setSelectedTime(time)}
                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                       selectedTime === time 
                       ? 'bg-brand-800 text-white shadow-md' 
                       : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                     }`}
                   >
                     {time}
                   </button>
                 ))}
               </div>
             </div>
           )}

          <button 
             disabled={!selectedDate || !selectedTime}
             onClick={handleNext}
             className="w-full mt-8 bg-brand-800 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
           >
             下一步
           </button>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === BookingStep.CONFIRM && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-100">
             <div className="bg-brand-50 p-4 border-b border-brand-100 flex gap-4">
                <img src={selectedService?.image} className="w-20 h-20 rounded-lg object-cover" alt="Service" />
                <div>
                  <h3 className="font-medium text-brand-900">{selectedService?.title}</h3>
                  <p className="text-brand-600 font-semibold mt-1">${selectedService?.price}</p>
                </div>
             </div>
             <div className="p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-50 pb-2">
                   <span className="text-brand-500 text-sm">美容師</span>
                   <span className="text-brand-800 font-medium">{selectedStylist?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-brand-50 pb-2">
                   <span className="text-brand-500 text-sm">日期</span>
                   <span className="text-brand-800 font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                   <span className="text-brand-500 text-sm">時間</span>
                   <span className="text-brand-800 font-medium">{selectedTime}</span>
                </div>
             </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="flex-1 bg-white text-brand-800 border border-brand-200 py-3 rounded-xl font-medium">上一步</button>
            <button onClick={submitBooking} disabled={isSubmitting} className="flex-[2] bg-brand-800 text-white py-3 rounded-xl font-medium flex justify-center items-center shadow-lg shadow-brand-200">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '確認送出'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;