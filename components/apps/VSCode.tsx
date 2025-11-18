import React from 'react';

export const VSCode: React.FC = () => {
  return (
    <div className="w-full h-full flex bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm">
      {/* Activity Bar */}
      <div className="w-12 flex flex-col items-center pt-4 gap-6 border-r border-[#333]">
        <i className="fa-regular fa-file text-2xl text-white hover:text-white cursor-pointer border-l-2 border-white pl-3 -ml-3.5"></i>
        <i className="fa-solid fa-magnifying-glass text-xl text-white/50 hover:text-white cursor-pointer"></i>
        <i className="fa-solid fa-code-branch text-xl text-white/50 hover:text-white cursor-pointer"></i>
        <i className="fa-solid fa-gear text-xl text-white/50 hover:text-white cursor-pointer mt-auto mb-4"></i>
      </div>

      {/* Sidebar */}
      <div className="w-48 bg-[#252526] flex flex-col border-r border-[#333]">
        <div className="text-xs font-bold p-3 uppercase text-gray-400 flex justify-between">
          Explorer <i className="fa-solid fa-ellipsis text-gray-500"></i>
        </div>
        <div className="pl-0">
          <div className="flex items-center gap-1 py-1 px-2 text-gray-300 font-bold bg-[#37373d] cursor-pointer">
            <i className="fa-solid fa-angle-down text-[10px]"></i> WIN11-SIM
          </div>
          <div className="flex flex-col text-gray-400">
             <div className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#e8e8e8] bg-[#37373d]/50">
               <i className="fa-brands fa-react text-blue-400 text-xs"></i> App.tsx
             </div>
             <div className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer">
               <i className="fa-brands fa-css3 text-blue-400 text-xs"></i> index.css
             </div>
             <div className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer">
               <i className="fa-brands fa-html5 text-orange-500 text-xs"></i> index.html
             </div>
             <div className="flex items-center gap-2 px-6 py-1 hover:bg-[#2a2d2e] cursor-pointer">
               <i className="fa-solid fa-file-code text-yellow-500 text-xs"></i> types.ts
             </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="h-9 bg-[#252526] flex items-center overflow-x-auto">
          <div className="h-full bg-[#1e1e1e] px-3 flex items-center gap-2 border-t border-blue-500 text-white text-xs min-w-fit pr-4">
            <i className="fa-brands fa-react text-blue-400"></i> App.tsx <i className="fa-solid fa-xmark ml-2 hover:bg-white/10 rounded p-0.5 cursor-pointer"></i>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="h-6 flex items-center px-4 text-xs text-gray-500 gap-2 bg-[#1e1e1e]">
          src <i className="fa-solid fa-angle-right text-[10px]"></i> App.tsx
        </div>

        {/* Code Area */}
        <div className="flex-1 relative bg-[#1e1e1e] overflow-auto">
           <textarea 
            className="w-full h-full bg-transparent text-[#d4d4d4] p-4 font-mono text-sm outline-none resize-none leading-relaxed"
            spellCheck={false}
            defaultValue={`import React from 'react';
import { Desktop } from './components';

const App = () => {
  return (
    <div className="os-container">
       {/* Windows 11 Simulator */}
       <h1>Hello World</h1>
       <Desktop />
    </div>
  );
};

export default App;`}
           />
        </div>
        
        {/* Footer */}
        <div className="h-6 bg-[#007acc] flex items-center px-3 text-white text-[10px] justify-between">
           <div className="flex gap-3">
              <span><i className="fa-solid fa-code-branch"></i> main</span>
              <span><i className="fa-regular fa-circle-xmark"></i> 0</span>
              <span><i className="fa-solid fa-triangle-exclamation"></i> 0</span>
           </div>
           <div className="flex gap-3">
              <span>Ln 12, Col 34</span>
              <span>UTF-8</span>
              <span>TypeScript React</span>
           </div>
        </div>
      </div>
    </div>
  );
};
