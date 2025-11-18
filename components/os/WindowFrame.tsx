import React, { useContext, useEffect, useRef, useState } from 'react';
import { SystemContext } from '../../App';
import { WindowState } from '../../types';
import { APPS } from '../../constants';

interface WindowFrameProps {
  windowState: WindowState;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ windowState }) => {
  const context = useContext(SystemContext);
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [relPos, setRelPos] = useState({ x: 0, y: 0 });

  if (!context) return null;
  const { activeWindowId, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPosition } = context;
  const isActive = activeWindowId === windowState.id;
  
  const config = APPS[windowState.appId];
  const AppComponent = config.component;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    e.stopPropagation();
    focusWindow(windowState.id);
    setIsDragging(true);
    setRelPos({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newX = e.clientX - relPos.x;
      let newY = e.clientY - relPos.y;

      if (newY < 0) newY = 0; 
      if (newY > window.innerHeight - 50) newY = window.innerHeight - 50;
      if (newX + windowState.width < 50) newX = 50 - windowState.width;
      if (newX > window.innerWidth - 50) newX = window.innerWidth - 50;

      updateWindowPosition(windowState.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, relPos, windowState.id, windowState.width, updateWindowPosition]);

  const style: React.CSSProperties = windowState.isMaximized ? {
    top: 0,
    left: 0,
    width: '100%',
    height: 'calc(100% - 48px)', 
    zIndex: windowState.zIndex,
    transform: 'scale(1)',
    borderRadius: 0
  } : {
    top: windowState.y,
    left: windowState.x,
    width: windowState.width,
    height: windowState.height,
    zIndex: windowState.zIndex,
  };

  return (
    <div 
      ref={windowRef}
      style={style}
      className={`absolute flex flex-col bg-win-bg shadow-win transition-[transform,opacity,width,height] duration-200 ease-out
        ${windowState.isMaximized ? '' : 'rounded-lg border border-gray-300/50'}
        ${isActive ? 'shadow-2xl shadow-black/20' : 'opacity-95'}
      `}
      onMouseDown={() => !isActive && focusWindow(windowState.id)}
    >
      <div 
        className={`h-9 flex items-center justify-between select-none ${windowState.isMaximized ? '' : 'rounded-t-lg'} bg-white/50 backdrop-blur-md border-b border-gray-200/50`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(windowState.id)}
      >
        <div className="flex items-center px-3 gap-2 flex-1 h-full">
          <img src={config.iconUrl} alt={config.title} className="w-4 h-4" />
          <span className="text-xs font-medium text-gray-700">{config.title}</span>
        </div>

        <div className="flex h-full">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(windowState.id); }}
            className="w-11 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 text-xs"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(windowState.id); }}
            className="w-11 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 text-xs"
          >
            {windowState.isMaximized ? 
              <i className="fa-regular fa-window-restore"></i> : 
              <i className="fa-regular fa-square"></i>
            }
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
            className={`w-11 h-full flex items-center justify-center transition-colors text-gray-600 hover:bg-red-500 hover:text-white text-xs ${windowState.isMaximized ? '' : 'rounded-tr-lg'}`}
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-white/90">
        <AppComponent windowId={windowState.id} />
      </div>
    </div>
  );
};