import React, { useContext, useState, useEffect } from 'react';
import { SystemContext } from '../../App';
import { AppID } from '../../types';

export const Explorer: React.FC<{ windowId: string }> = ({ windowId }) => {
  const context = useContext(SystemContext);
  const [currentPathId, setCurrentPathId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>(['root']);
  const [historyIndex, setHistoryIndex] = useState(0);

  if (!context) return null;
  const { files, windows, openApp, deleteFile } = context;

  // Detect if opened as "Trash"
  const windowState = windows.find(w => w.id === windowId);
  useEffect(() => {
    if (windowState?.appId === 'trash') {
      setCurrentPathId('trash');
      setHistory(['trash']);
    }
  }, [windowState?.appId]);

  const currentFolder = files.find(f => f.id === currentPathId);
  const folderContents = files.filter(f => f.parentId === currentPathId);

  const handleNavigate = (folderId: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPathId(folderId);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentPathId(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentPathId(history[historyIndex + 1]);
    }
  };

  const handleUp = () => {
    if (currentFolder && currentFolder.parentId) {
      handleNavigate(currentFolder.parentId);
    }
  };

  const handleItemDoubleClick = (item: any) => {
    if (item.type === 'folder') {
      handleNavigate(item.id);
    } else {
      // Open file logic (simple assumption: txt opens in notepad)
      if (item.name.endsWith('.txt')) {
        openApp('notepad'); // In a real app, we'd pass the file ID to notepad
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f3f3f3]">
      {/* Toolbar */}
      <div className="h-12 flex items-center px-2 bg-[#f3f3f3] border-b border-gray-200 gap-2">
        <button className="px-3 py-1.5 hover:bg-white rounded text-xs flex items-center gap-2 transition-colors shadow-sm border border-transparent hover:border-gray-200">
          <i className="fa-solid fa-plus text-blue-600"></i> New
        </button>
        <div className="h-6 w-[1px] bg-gray-300 mx-1"></div>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm disabled:opacity-30"><i className="fa-regular fa-copy"></i></button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm disabled:opacity-30"><i className="fa-regular fa-paste"></i></button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm disabled:opacity-30"><i className="fa-solid fa-scissors"></i></button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm disabled:opacity-30"><i className="fa-solid fa-trash-can"></i></button>
      </div>

      {/* Navigation Bar */}
      <div className="h-10 flex items-center px-3 gap-3 bg-white border-b border-gray-200">
        <div className="flex gap-1 text-gray-500">
          <button onClick={handleBack} disabled={historyIndex === 0} className="hover:bg-gray-100 p-1.5 rounded disabled:opacity-30"><i className="fa-solid fa-arrow-left text-xs"></i></button>
          <button onClick={handleForward} disabled={historyIndex === history.length - 1} className="hover:bg-gray-100 p-1.5 rounded disabled:opacity-30"><i className="fa-solid fa-arrow-right text-xs"></i></button>
          <button onClick={handleUp} disabled={!currentFolder?.parentId} className="hover:bg-gray-100 p-1.5 rounded disabled:opacity-30"><i className="fa-solid fa-arrow-up text-xs"></i></button>
        </div>
        
        <div className="flex-1 h-7 border border-gray-300 rounded flex items-center px-2 hover:border-blue-400 transition-colors group">
          <i className={`${currentFolder?.iconClass || 'fa-solid fa-computer'} text-gray-500 text-xs mr-2`}></i>
          <span className="text-xs text-gray-700 w-full">{currentFolder?.name || 'This PC'}</span>
        </div>

        <div className="w-48 h-7 border border-gray-300 rounded flex items-center px-2 hover:border-blue-400 transition-colors">
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
          <input type="text" placeholder={`Search ${currentFolder?.name || 'This PC'}`} className="w-full text-xs outline-none bg-transparent text-gray-600 placeholder-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#f3f3f3] border-r border-gray-200 flex flex-col py-2 overflow-y-auto">
          <SidebarItem icon="fa-solid fa-desktop text-blue-400" label="Desktop" onClick={() => handleNavigate('desktop')} active={currentPathId === 'desktop'} />
          <SidebarItem icon="fa-solid fa-folder-open text-yellow-500" label="Documents" onClick={() => handleNavigate('docs')} active={currentPathId === 'docs'} />
          <SidebarItem icon="fa-solid fa-image text-purple-500" label="Pictures" onClick={() => handleNavigate('pics')} active={currentPathId === 'pics'} />
          <div className="h-[1px] bg-gray-300 mx-3 my-2"></div>
          <SidebarItem icon="fa-solid fa-trash-can text-gray-500" label="Recycle Bin" onClick={() => handleNavigate('trash')} active={currentPathId === 'trash'} />
        </div>

        {/* File Grid */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          {folderContents.length === 0 ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
               <span className="text-sm">This folder is empty.</span>
             </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
              {folderContents.map(item => (
                <div 
                  key={item.id}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  className="group flex flex-col items-center p-2 hover:bg-blue-50 hover:shadow-sm border border-transparent hover:border-blue-100 rounded cursor-default transition-all"
                >
                   <i className={`${item.iconClass} ${item.iconColor || 'text-gray-500'} text-4xl mb-2 drop-shadow-sm group-hover:scale-105 transition-transform`}></i>
                   <span className="text-[11px] text-center text-gray-700 leading-tight break-words w-full line-clamp-2 group-hover:text-black">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Status */}
      <div className="h-6 bg-[#f3f3f3] border-t border-gray-200 flex items-center px-3 text-[11px] text-gray-600 gap-4">
        <span>{folderContents.length} items</span>
        <span className="border-l border-gray-300 pl-4">1 item selected</span>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 text-xs text-gray-700 w-full hover:bg-gray-200/50 transition-colors ${active ? 'bg-blue-100/50 text-blue-800 font-medium' : ''}`}
  >
    <i className={`${icon} text-sm w-5 text-center`}></i>
    {label}
  </button>
);
