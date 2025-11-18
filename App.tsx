
import React, { useState, useCallback } from 'react';
import { WindowState, AppID, SystemContextType, FileNode } from './types';
import { APPS } from './constants';
import { Taskbar } from './components/os/Taskbar';
import { Desktop } from './components/os/Desktop';
import { StartMenu } from './components/os/StartMenu';
import { WindowFrame } from './components/os/WindowFrame';
import { ContextMenu } from './components/os/ContextMenu';

export const SystemContext = React.createContext<SystemContextType | null>(null);

const INITIAL_FILES: FileNode[] = [
  { id: 'root', name: 'This PC', type: 'folder', parentId: null },
  { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'root', iconClass: 'fa-solid fa-desktop', iconColor: 'text-blue-400' },
  { id: 'docs', name: 'Documents', type: 'folder', parentId: 'root', iconClass: 'fa-solid fa-folder-open', iconColor: 'text-yellow-500' },
  { id: 'pics', name: 'Pictures', type: 'folder', parentId: 'root', iconClass: 'fa-solid fa-image', iconColor: 'text-purple-500' },
  { id: 'trash', name: 'Recycle Bin', type: 'folder', parentId: 'root', iconClass: 'fa-solid fa-trash-can', iconColor: 'text-gray-500' },
  
  // Documents
  { id: 'resume', name: 'Resume.txt', type: 'file', parentId: 'docs', content: 'John Doe\n\nFrontend Developer\n\nExperience: Building Windows 11 in React.' },
  { id: 'todo', name: 'Todo.txt', type: 'file', parentId: 'docs', content: '- Buy milk\n- Fix bugs\n- Deploy app' },
  
  // Pictures
  { id: 'pic1', name: 'Mountain.jpg', type: 'file', parentId: 'pics' },
];

const WALLPAPERS = [
    "https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/wallpaper/default/img0.jpg", // Light Bloom
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Dark Bloom
    "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=2000&q=80", // Mountains
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" // Landscape
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  
  const [wallpaperUrl, setWallpaperUrl] = useState(WALLPAPERS[0]);
  const [contextMenu, setContextMenu] = useState<{show: boolean, x: number, y: number} | null>(null);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    if (id) {
        setWindows(prev => prev.map(win => {
        if (win.id === id) {
            return { ...win, zIndex: nextZIndex, isMinimized: false };
        }
        return win;
        }));
        setNextZIndex(prev => prev + 1);
    }
    setStartMenuOpen(false);
    setContextMenu(null);
  }, [nextZIndex]);

  const openApp = useCallback((appId: AppID, initialPath?: string) => {
    const config = APPS[appId];
    if (!config) return;

    const id = `${appId}-${Date.now()}`;
    const centerX = Math.max(0, (window.innerWidth / 2) - (config.defaultWidth / 2) + (windows.length * 20));
    const centerY = Math.max(0, (window.innerHeight / 2) - (config.defaultHeight / 2) + (windows.length * 20));

    const newWindow: WindowState = {
      id,
      appId,
      title: config.title,
      x: centerX,
      y: centerY,
      width: config.defaultWidth,
      height: config.defaultHeight,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(id);
    setStartMenuOpen(false);
    setContextMenu(null);
  }, [nextZIndex, windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
    setContextMenu(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
    setContextMenu(null);
  }, [focusWindow]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  // File System Operations
  const createFile = useCallback((name: string, type: 'folder'|'file', parentId: string, content: string = '') => {
    const newFile: FileNode = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      parentId,
      content,
      iconClass: type === 'folder' ? 'fa-solid fa-folder' : 'fa-regular fa-file',
      iconColor: type === 'folder' ? 'text-yellow-500' : 'text-gray-500'
    };
    setFiles(prev => [...prev, newFile]);
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (!file) return prev;
      
      if (file.parentId === 'trash') {
        return prev.filter(f => f.id !== id);
      } else {
        return prev.map(f => f.id === id ? { ...f, parentId: 'trash' } : f);
      }
    });
  }, []);

  const updateFile = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  }, []);

  const changeWallpaper = useCallback((url?: string) => {
    if (url) {
        setWallpaperUrl(url);
    } else {
        // Cycle next
        const idx = WALLPAPERS.indexOf(wallpaperUrl);
        const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
        setWallpaperUrl(next);
    }
  }, [wallpaperUrl]);

  // Interaction Handlers
  const handleGlobalClick = (e: React.MouseEvent) => {
      // Close generic system overlays
      if (contextMenu) setContextMenu(null);
      if (startMenuOpen && !(e.target as HTMLElement).closest('.start-menu-trigger')) {
          setStartMenuOpen(false);
      }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if right click is on a specific window or app, if so, we might want a different menu
    // For now, global desktop menu
    setContextMenu({ show: true, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const systemValue: SystemContextType = {
    windows,
    activeWindowId,
    startMenuOpen,
    files,
    wallpaperUrl,
    toggleStartMenu,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    createFile,
    deleteFile,
    updateFile,
    changeWallpaper
  };

  return (
    <SystemContext.Provider value={systemValue}>
      <div 
        className="relative w-screen h-screen overflow-hidden bg-cover bg-center bg-no-repeat select-none"
        style={{ backgroundImage: `url('${wallpaperUrl}')` }}
        onClick={handleGlobalClick}
        onContextMenu={handleContextMenu}
      >
        {/* Desktop Layer */}
        <Desktop />

        {/* Windows Layer */}
        {windows.map(win => (
           !win.isMinimized && <WindowFrame key={win.id} windowState={win} />
        ))}

        {/* Context Menu Layer */}
        {contextMenu && contextMenu.show && (
            <ContextMenu x={contextMenu.x} y={contextMenu.y} closeMenu={closeContextMenu} />
        )}

        {/* System Overlays */}
        {startMenuOpen && <StartMenu />}
        
        <Taskbar />
      </div>
    </SystemContext.Provider>
  );
};

export default App;
