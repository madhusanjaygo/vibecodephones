
import React, { useContext } from 'react';
import { SystemContext } from '../../App';

interface ContextMenuProps {
  x: number;
  y: number;
  closeMenu: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, closeMenu }) => {
  const context = useContext(SystemContext);

  const handleRefresh = () => {
    closeMenu();
    // Trigger a fake refresh animation
    const root = document.getElementById('root');
    if (root) {
        root.style.filter = 'blur(0.5px)';
        setTimeout(() => root.style.filter = 'none', 100);
    }
  };

  const handleNewFolder = () => {
    context?.createFile(`New Folder`, 'folder', 'desktop');
    closeMenu();
  };

  const handlePersonalize = () => {
    context?.changeWallpaper();
    closeMenu();
  };

  // Adjust position if close to edge
  const adjustedX = x + 250 > window.innerWidth ? x - 250 : x;
  const adjustedY = y + 300 > window.innerHeight ? y - 300 : y;

  return (
    <div 
      className="absolute z-[9999] w-64 bg-[#f9f9f9]/80 backdrop-blur-2xl border border-white/40 rounded-lg shadow-2xl py-1.5 text-sm select-none animate-in fade-in zoom-in-95 duration-75 origin-top-left"
      style={{ top: adjustedY, left: adjustedX, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()} 
    >
      <MenuItem iconClass="fa-solid fa-border-all" label="View">
          <i className="fa-solid fa-chevron-right text-[10px] ml-auto text-gray-500"></i>
      </MenuItem>
      <MenuItem iconClass="fa-solid fa-arrow-down-a-z" label="Sort by">
         <i className="fa-solid fa-chevron-right text-[10px] ml-auto text-gray-500"></i>
      </MenuItem>
      <MenuItem iconClass="fa-solid fa-rotate-right" label="Refresh" onClick={handleRefresh} />
      
      <div className="h-[1px] bg-gray-300/40 my-1.5 mx-2"></div>
      
      <MenuItem iconClass="fa-solid fa-plus" label="New" onClick={handleNewFolder}>
          <i className="fa-solid fa-chevron-right text-[10px] ml-auto text-gray-500"></i>
      </MenuItem>
      
      <div className="h-[1px] bg-gray-300/40 my-1.5 mx-2"></div>

      <MenuItem iconClass="fa-solid fa-display" label="Display settings" />
      <MenuItem iconClass="fa-solid fa-wand-magic-sparkles" label="Personalize" onClick={handlePersonalize} />
      
      <div className="h-[1px] bg-gray-300/40 my-1.5 mx-2"></div>
      
      <MenuItem iconClass="fa-regular fa-window-restore" label="Open in Terminal" />
      <MenuItem iconClass="fa-solid fa-ellipsis" label="Show more options" />
    </div>
  );
};

const MenuItem: React.FC<{ iconClass: string; label: string; onClick?: () => void; children?: React.ReactNode }> = ({ iconClass, label, onClick, children }) => (
  <div 
    onClick={onClick}
    className="flex items-center px-3 mx-1 py-1.5 rounded hover:bg-black/5 cursor-default transition-colors group"
  >
    <div className="w-8 flex justify-start items-center text-gray-600">
       {/* Fixed width for icon alignment */}
       <i className={`${iconClass} text-sm`}></i>
    </div>
    <span className="flex-1 font-[400] text-gray-800 tracking-wide text-[13px]">{label}</span>
    {children}
  </div>
);
