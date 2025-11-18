
import React, { useContext, useState, useEffect } from 'react';
import { SystemContext } from '../../App';
import { APPS } from '../../constants';
import { AppID } from '../../types';
import { CalendarWidget } from './CalendarWidget';
import { QuickSettings } from './QuickSettings';

export const Taskbar: React.FC = () => {
  const context = useContext(SystemContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      const handleGlobalClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (!target.closest('.taskbar-component')) {
              setShowCalendar(false);
              setShowQuickSettings(false);
          }
      }
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
  }, []);


  if (!context) return null;
  const { toggleStartMenu, startMenuOpen, openApp, windows, activeWindowId, minimizeWindow, focusWindow } = context;

  const handleAppClick = (appId: AppID) => {
    const openInstances = windows.filter(w => w.appId === appId);
    
    if (openInstances.length === 0) {
      openApp(appId);
    } else if (openInstances.length === 1) {
      const instance = openInstances[0];
      if (instance.isMinimized || activeWindowId !== instance.id) {
        focusWindow(instance.id);
      } else {
        minimizeWindow(instance.id);
      }
    } else {
      focusWindow(openInstances[openInstances.length - 1].id);
    }
    setShowCalendar(false);
    setShowQuickSettings(false);
  };

  const handleStartClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleStartMenu();
      setShowCalendar(false);
      setShowQuickSettings(false);
  }

  const isOpen = (appId: string) => windows.some(w => w.appId === appId);
  const isActive = (appId: string) => {
    const activeWin = windows.find(w => w.id === activeWindowId);
    return activeWin?.appId === appId;
  };

  return (
    <>
    {/* Widgets rendered outside taskbar but controlled by it */}
    {showCalendar && <CalendarWidget />}
    {showQuickSettings && <QuickSettings />}

    <div className="taskbar-component absolute bottom-0 w-full h-12 backdrop-blur-2xl bg-[#f3f3f3]/85 border-t border-white/40 flex items-center justify-between px-2 z-[9999] shadow-win">
      
      <div className="flex-1"></div>

      {/* Center Dock */}
      <div className="flex items-center gap-1 h-full">
        <button 
          onClick={handleStartClick}
          className={`h-10 w-10 rounded-md hover:bg-white/50 flex items-center justify-center transition-all active:scale-90 duration-200 relative group ${startMenuOpen ? 'bg-white/50' : ''}`}
        >
          <img src="https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/home.png" alt="Start" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <Tooltip label="Start" />
        </button>

        <TaskbarIcon iconUrl="https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/search.png" label="Search" />
        
        {/* Task View - Simulated */}
        <button className="h-10 w-10 rounded-md hover:bg-white/50 flex items-center justify-center transition-all active:scale-90 duration-200 relative group">
           <img src="https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/taskview.png" alt="Task View" className="w-5 h-5" onError={(e) => e.currentTarget.style.display='none'} />
           {/* Fallback icon if image fails */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-4 h-4 border-2 border-gray-700/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div> 
             {/* Just a placeholder visual if img missing, but using a generic icon for now */}
             <i className="fa-regular fa-square-caret-right text-gray-700 text-lg"></i> 
           </div>
           <Tooltip label="Task View" />
        </button>

        <TaskbarIcon iconUrl="https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/widget.png" label="Widgets" />
        
        {/* Pinned Apps */}
        <TaskbarAppIcon appId="explorer" isOpen={isOpen('explorer')} isActive={isActive('explorer')} onClick={() => handleAppClick('explorer')} />
        <TaskbarAppIcon appId="edge" isOpen={isOpen('edge')} isActive={isActive('edge')} onClick={() => handleAppClick('edge')} />
        <TaskbarAppIcon appId="vscode" isOpen={isOpen('vscode')} isActive={isActive('vscode')} onClick={() => handleAppClick('vscode')} />
        <TaskbarAppIcon appId="notepad" isOpen={isOpen('notepad')} isActive={isActive('notepad')} onClick={() => handleAppClick('notepad')} />
        <TaskbarAppIcon appId="calculator" isOpen={isOpen('calculator')} isActive={isActive('calculator')} onClick={() => handleAppClick('calculator')} />

      </div>

      {/* Right Tray */}
      <div className="flex-1 flex justify-end items-center h-full pl-2">
        
        {/* Show Hidden Icons Arrow */}
        <div className="h-8 w-6 flex items-center justify-center hover:bg-white/50 rounded-md transition-colors cursor-default group relative">
          <i className="fa-solid fa-angle-up text-xs text-gray-600"></i>
          <Tooltip label="Show hidden icons" />
        </div>
        
        {/* Quick Settings Pill */}
        <div 
            className={`h-10 flex items-center gap-2.5 px-3 mx-1 rounded-md transition-all duration-200 cursor-pointer hover:bg-white/50 active:scale-95 border border-transparent hover:border-white/10 group relative ${showQuickSettings ? 'bg-white/50' : ''}`}
            onClick={(e) => { e.stopPropagation(); setShowQuickSettings(!showQuickSettings); setShowCalendar(false); }}
        >
          <i className="fa-solid fa-wifi text-xs text-gray-700"></i>
          <i className="fa-solid fa-volume-high text-xs text-gray-700"></i>
          <i className="fa-solid fa-battery-full text-xs text-gray-700"></i>
          <Tooltip label="Internet access • Volume • Battery" />
        </div>

        {/* Clock / Date */}
        <div 
            className={`h-10 flex flex-col justify-center items-end px-3 rounded-md transition-all duration-200 cursor-pointer hover:bg-white/50 active:scale-95 border border-transparent hover:border-white/10 group relative ${showCalendar ? 'bg-white/50' : ''}`}
            onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); setShowQuickSettings(false); }}
        >
          <div className="text-xs font-medium text-gray-800 leading-tight">
            {currentTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
          </div>
          <div className="text-[10px] text-gray-700 leading-tight">
            {currentTime.toLocaleDateString()}
          </div>
          <Tooltip label={currentTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
        </div>
        
        {/* Show Desktop Slice */}
        <div 
          className="w-1.5 h-full ml-2 hover:bg-white/50 cursor-pointer border-l border-gray-400/20 group relative"
          onClick={() => {
            windows.forEach(w => minimizeWindow(w.id));
          }}
        >
           <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-[#202020] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity delay-700 -translate-x-full">
              Show desktop
           </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Tooltip: React.FC<{ label: string }> = ({ label }) => (
  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#202020] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500 pointer-events-none whitespace-nowrap z-[10000] shadow-lg border border-white/10 font-normal tracking-wide">
    {label}
  </div>
);

const TaskbarIcon: React.FC<{ iconUrl: string, label: string }> = ({ iconUrl, label }) => (
  <button className="h-10 w-10 rounded-md hover:bg-white/50 flex items-center justify-center transition-all active:scale-90 duration-200 relative group">
    <img src={iconUrl} alt={label} className="w-6 h-6" />
    <Tooltip label={label} />
  </button>
);

const TaskbarAppIcon: React.FC<{ appId: string, onClick: () => void, isOpen: boolean, isActive: boolean }> = ({ appId, onClick, isOpen, isActive }) => {
  const config = APPS[appId];
  if (!config) return null;

  return (
    <button 
      onClick={onClick}
      className={`h-10 w-10 rounded-md hover:bg-white/50 flex items-center justify-center transition-all active:scale-90 duration-200 relative group ${isActive ? 'bg-white/50' : ''}`}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-100' : 'group-hover:scale-105'}`}>
        <img src={config.iconUrl} alt={config.title} className="w-6 h-6 drop-shadow-sm" />
      </div>
      
      {/* Active/Running Indicator */}
      {isOpen && (
        <div className={`absolute bottom-0.5 h-[3px] rounded-full transition-all duration-300 bg-gray-400 ${isActive ? 'w-4 bg-blue-500' : 'w-1.5 group-hover:w-2'}`}></div>
      )}
      
      <Tooltip label={config.title} />
    </button>
  );
};
