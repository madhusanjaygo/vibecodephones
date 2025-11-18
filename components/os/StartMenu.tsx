import React, { useContext, useState, useMemo } from 'react';
import { SystemContext } from '../../App';
import { APPS } from '../../constants';
import { AppID } from '../../types';

export const StartMenu: React.FC = () => {
  const context = useContext(SystemContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!context) return null;
  const { startMenuOpen, openApp } = context;

  const filteredApps = useMemo(() => {
      if (!searchQuery) return Object.keys(APPS);
      return Object.keys(APPS).filter(id => 
          APPS[id].title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  // Helper to render grid items
  const PinnedApp = ({ id }: { id: string }) => {
    const app = APPS[id];
    if (!app) return null;
    return (
      <button 
        onClick={() => openApp(id as AppID)}
        className="flex flex-col items-center gap-2 p-2 hover:bg-white/50 rounded transition-colors group"
      >
        <div className="bg-white/80 h-8 w-8 rounded flex items-center justify-center shadow-sm group-hover:shadow group-active:scale-95 transition-all">
           <img src={app.iconUrl} alt={app.title} className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-medium text-gray-700">{app.title}</span>
      </button>
    );
  };

  return (
    <div 
      className={`absolute bottom-14 left-1/2 -translate-x-1/2 w-[500px] h-[550px] 
      bg-win-glass/95 backdrop-blur-2xl rounded-lg shadow-glass border border-win-border 
      flex flex-col overflow-hidden transition-all duration-300 origin-bottom z-[10000]
      ${startMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-6 pb-2">
        <div className="bg-[#f3f3f3] border-b-2 border-blue-600/50 rounded flex items-center px-3 py-2 gap-2 shadow-inner ring-1 ring-transparent focus-within:ring-blue-400/30 transition-all">
          <i className="fa-solid fa-magnifying-glass text-gray-500 text-sm"></i>
          <input 
            type="text" 
            placeholder="Type here to search" 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
        
        {searchQuery ? (
             /* Search Results View */
             <div>
                 <h3 className="text-xs font-bold text-gray-700 ml-1 mb-4">Best match</h3>
                 <div className="flex flex-col gap-1">
                    {filteredApps.length > 0 ? filteredApps.map(id => {
                         const app = APPS[id];
                         return (
                            <button 
                                key={id}
                                onClick={() => openApp(id as AppID)}
                                className="flex items-center gap-3 p-2 hover:bg-white/50 rounded text-left group"
                            >
                                <img src={app.iconUrl} alt={app.title} className="w-8 h-8" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">{app.title}</span>
                                    <span className="text-xs text-gray-500">App</span>
                                </div>
                                <i className="fa-solid fa-chevron-right ml-auto text-xs text-transparent group-hover:text-gray-500"></i>
                            </button>
                         );
                    }) : (
                        <div className="text-center mt-10 text-gray-500 text-sm">
                            No results for "{searchQuery}"
                        </div>
                    )}
                 </div>
             </div>
        ) : (
            /* Default Pinned View */
            <>
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-700 ml-1">Pinned</h3>
                <button className="text-xs bg-white/40 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-white/60 transition-colors">
                    All apps <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
                </div>
                
                <div className="grid grid-cols-6 gap-2 mb-8">
                <PinnedApp id="edge" />
                <PinnedApp id="notepad" />
                <PinnedApp id="vscode" />
                <PinnedApp id="calculator" />
                <PinnedApp id="explorer" />
                
                {/* Dummy items */}
                <div className="flex flex-col items-center gap-2 p-2 opacity-60 cursor-not-allowed grayscale transition-opacity hover:opacity-80">
                    <div className="bg-white/50 h-8 w-8 rounded flex items-center justify-center shadow-sm">
                        <i className="fa-brands fa-spotify text-green-500 text-lg"></i>
                    </div>
                    <span className="text-[11px]">Spotify</span>
                </div>
                 <div className="flex flex-col items-center gap-2 p-2 opacity-60 cursor-not-allowed grayscale transition-opacity hover:opacity-80">
                     <div className="bg-white/50 h-8 w-8 rounded flex items-center justify-center shadow-sm">
                        <i className="fa-brands fa-xbox text-green-600 text-lg"></i>
                    </div>
                    <span className="text-[11px]">Xbox</span>
                </div>
                 <div className="flex flex-col items-center gap-2 p-2 opacity-60 cursor-not-allowed grayscale transition-opacity hover:opacity-80">
                     <div className="bg-white/50 h-8 w-8 rounded flex items-center justify-center shadow-sm">
                        <i className="fa-brands fa-twitter text-blue-400 text-lg"></i>
                    </div>
                    <span className="text-[11px]">Twitter</span>
                </div>
                </div>

                {/* Recommended */}
                <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-gray-700 ml-1">Recommended</h3>
                    <button className="text-xs bg-white/40 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-white/60 transition-colors">
                    More <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer transition-colors">
                    <i className="fa-regular fa-file-word text-blue-700 text-xl"></i>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-800">Resume.docx</span>
                        <span className="text-[10px] text-gray-500">15m ago</span>
                    </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer transition-colors">
                    <i className="fa-solid fa-image text-purple-600 text-xl"></i>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-800">Vacation.png</span>
                        <span className="text-[10px] text-gray-500">2h ago</span>
                    </div>
                    </div>
                </div>
                </div>
            </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-200/40 backdrop-blur-md h-14 px-8 flex items-center justify-between border-t border-win-border mt-auto">
        <div className="flex items-center gap-3 hover:bg-white/50 p-1.5 pr-4 rounded transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-sm border border-white/20">
            G
          </div>
          <span className="text-xs font-medium text-gray-700">Guest User</span>
        </div>
        
        <button className="h-9 w-9 hover:bg-white/50 rounded flex items-center justify-center transition-colors text-gray-700">
          <i className="fa-solid fa-power-off"></i>
        </button>
      </div>
    </div>
  );
};