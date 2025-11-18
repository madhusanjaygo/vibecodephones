import React from 'react';

export const CalendarWidget: React.FC = () => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();
  
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentYear, today.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div 
        className="absolute bottom-14 right-4 w-[340px] bg-win-glass/95 backdrop-blur-3xl rounded-xl shadow-glass border border-win-border p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-5 fade-in duration-200 z-[9999]"
        onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center text-gray-700 px-2">
        <span className="text-sm font-semibold">{currentMonth} {currentYear}</span>
        <div className="flex gap-1">
          <button className="hover:bg-white/50 p-1.5 rounded-full transition-colors"><i className="fa-solid fa-chevron-up text-xs"></i></button>
          <button className="hover:bg-white/50 p-1.5 rounded-full transition-colors"><i className="fa-solid fa-chevron-down text-xs"></i></button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-medium">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      
      <div className="grid grid-cols-7 text-center text-sm gap-y-2">
        {days.map((d, i) => (
          <div key={i} className="flex justify-center items-center aspect-square">
             {d && (
               <div className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/40 cursor-pointer transition-all ${d === currentDay ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700'}`}>
                 {d}
               </div>
             )}
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-300/30 pt-4">
         <div className="text-sm font-semibold text-gray-700 px-2 mb-2">Today</div>
         <div className="flex flex-col gap-2">
            <div className="bg-white/60 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
               <div className="text-xs font-bold text-gray-800">Team Meeting</div>
               <div className="text-[10px] text-gray-600">10:00 AM - 11:00 AM</div>
            </div>
             <div className="bg-white/60 p-3 rounded-lg border-l-4 border-purple-500 shadow-sm">
               <div className="text-xs font-bold text-gray-800">Project Review</div>
               <div className="text-[10px] text-gray-600">2:00 PM - 3:00 PM</div>
            </div>
         </div>
      </div>
    </div>
  );
};