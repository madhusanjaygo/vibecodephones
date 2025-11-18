
import React, { useContext, useState, useRef, useEffect } from 'react';
import { SystemContext } from '../../App';
import { APPS } from '../../constants';
import { AppID } from '../../types';

interface DesktopIcon {
  id: string;
  appId?: AppID;
  label: string;
  iconUrl: string;
  type: 'app' | 'link' | 'folder';
}

export const Desktop: React.FC = () => {
  const context = useContext(SystemContext);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{x: number, y: number, w: number, h: number} | null>(null);
  const dragStart = useRef<{x: number, y: number} | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Desktop Icons definition
  const icons: DesktopIcon[] = [
    { id: 'desk-trash', appId: 'trash', label: 'Recycle Bin', iconUrl: APPS.trash.iconUrl, type: 'app' },
    { id: 'desk-explorer', appId: 'explorer', label: 'This PC', iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/computer.png', type: 'app' },
    { id: 'desk-edge', appId: 'edge', label: 'Microsoft Edge', iconUrl: APPS.edge.iconUrl, type: 'app' },
    { id: 'desk-vscode', appId: 'vscode', label: 'VS Code', iconUrl: APPS.vscode.iconUrl, type: 'app' },
    { id: 'desk-github', label: 'GitHub', iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/github.png', type: 'link' },
    { id: 'desk-portfolio', label: 'Portfolio', iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/folder.png', type: 'folder' },
  ];

  // Handle Icon Click (Single Select)
  const handleIconClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Ctrl key for multi-select
    if (e.ctrlKey) {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    } else {
        setSelectedIds(new Set([id]));
    }
  };

  // Handle Icon Double Click (Open App)
  const handleDoubleClick = (icon: DesktopIcon) => {
    if (icon.appId) {
        context?.openApp(icon.appId);
    } else if (icon.type === 'link') {
        window.open('https://github.com', '_blank');
    } else if (icon.type === 'folder') {
        context?.openApp('explorer');
    }
    setSelectedIds(new Set([]));
  };

  // Mouse Down: Start Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if clicking directly on the desktop container
    if (e.target === desktopRef.current || e.target === e.currentTarget) {
       dragStart.current = { x: e.clientX, y: e.clientY };
       setSelectedIds(new Set()); // Clear selection on click empty space
       context?.focusWindow(''); // Deselect windows
    }
  };

  // Mouse Move: Update Drag Box & Selection Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;

      const startX = dragStart.current.x;
      const startY = dragStart.current.y;
      const currentX = e.clientX;
      const currentY = e.clientY;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const w = Math.abs(currentX - startX);
      const h = Math.abs(currentY - startY);

      setSelectionBox({ x, y, w, h });

      // Intersection Logic
      const newSelected = new Set<string>();
      icons.forEach(icon => {
          const el = document.getElementById(icon.id);
          if (el) {
              const rect = el.getBoundingClientRect();
              // Simple box intersection check
              if (x < rect.right && x + w > rect.left && y < rect.bottom && y + h > rect.top) {
                  newSelected.add(icon.id);
              }
          }
      });
      setSelectedIds(newSelected);
    };

    const handleMouseUp = () => {
      dragStart.current = null;
      setSelectionBox(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [icons]);

  return (
    <div 
      ref={desktopRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      onMouseDown={handleMouseDown}
    >
      {/* Grid Container */}
      <div 
        className="w-full h-full p-1 grid grid-rows-[repeat(auto-fill,104px)] grid-flow-col content-start justify-start gap-y-1 gap-x-2 pointer-events-none"
      >
        {icons.map((icon) => (
          <div 
            key={icon.id}
            id={icon.id}
            className={`w-[76px] h-[100px] flex flex-col items-center justify-start pt-2 gap-1 rounded border border-transparent transition-all cursor-default pointer-events-auto
              ${selectedIds.has(icon.id) 
                ? 'bg-white/20 border-white/30 backdrop-blur-[2px]' 
                : 'hover:bg-white/10'
              }
            `}
            onClick={(e) => handleIconClick(icon.id, e)}
            onDoubleClick={() => handleDoubleClick(icon)}
          >
            <img src={icon.iconUrl} alt={icon.label} className="w-12 h-12 drop-shadow-md object-contain" />
            <span 
                className={`text-[12px] text-center text-white leading-tight line-clamp-2 px-1
                   ${selectedIds.has(icon.id) ? '' : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'}
                `}
                style={{ fontFamily: '"Segoe UI", sans-serif' }}
            >
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* Selection Box */}
      {selectionBox && (
        <div 
          className="absolute bg-blue-500/30 border border-blue-500/70 pointer-events-none z-50"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.w,
            height: selectionBox.h
          }}
        />
      )}
    </div>
  );
};
