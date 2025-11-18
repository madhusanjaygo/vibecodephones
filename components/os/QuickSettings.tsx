import React, { useState } from 'react';

export const QuickSettings: React.FC = () => {
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);

  const ToggleButton = ({ icon, label, active, onClick }: any) => (
    <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer">
        <div className={`w-24 h-12 rounded-full flex items-center justify-center border transition-all duration-200 ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/50 border-gray-300 text-gray-800 hover:bg-white/80'}`}>
           <i className={`${icon} text-lg`}></i>
        </div>
        <span className="text-xs text-gray-700">{label}</span>
    </div>
  );

  const Slider = ({ icon, value, onChange }: any) => (
    <div className="flex items-center gap-4">
       <i className={`${icon} text-gray-600 w-4 text-center`}></i>
       <input 
         type="range" 
         min="0" max="100" 
         value={value} 
         onChange={(e) => onChange(parseInt(e.target.value))}
         className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
       />
    </div>
  );

  return (
    <div 
        className="absolute bottom-14 right-4 w-[360px] bg-[#f3f3f3]/95 backdrop-blur-2xl rounded-xl shadow-glass border border-gray-200/50 p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-5 fade-in duration-200 z-[9999]"
        onClick={(e) => e.stopPropagation()}
    >
       <div className="grid grid-cols-3 gap-4">
          <ToggleButton icon="fa-solid fa-wifi" label="Wi-Fi" active={wifi} onClick={() => setWifi(!wifi)} />
          <ToggleButton icon="fa-brands fa-bluetooth-b" label="Bluetooth" active={bluetooth} onClick={() => setBluetooth(!bluetooth)} />
          <ToggleButton icon="fa-solid fa-plane" label="Airplane" active={airplane} onClick={() => setAirplane(!airplane)} />
          <ToggleButton icon="fa-solid fa-moon" label="Night Light" active={false} onClick={() => {}} />
          <ToggleButton icon="fa-solid fa-battery-full" label="Saver" active={false} onClick={() => {}} />
          <ToggleButton icon="fa-solid fa-pen" label="Focus" active={false} onClick={() => {}} />
       </div>

       <div className="flex flex-col gap-5">
          <Slider icon="fa-solid fa-sun" value={brightness} onChange={setBrightness} />
          <Slider icon="fa-solid fa-volume-high" value={volume} onChange={setVolume} />
       </div>

       <div className="border-t border-gray-300/50 pt-4 flex justify-between items-center">
          <div className="flex gap-2 text-xs text-gray-600">
             <div className="flex items-center gap-2 hover:bg-white/50 px-2 py-1 rounded cursor-pointer transition-colors">
                <i className="fa-solid fa-battery-three-quarters text-green-600"></i> 78%
             </div>
          </div>
          <div className="flex gap-3 text-gray-600">
             <i className="fa-solid fa-gear hover:bg-white/50 p-2 rounded-full cursor-pointer transition-colors"></i>
             <i className="fa-solid fa-pen hover:bg-white/50 p-2 rounded-full cursor-pointer transition-colors"></i>
          </div>
       </div>
    </div>
  );
};