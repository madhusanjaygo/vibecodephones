import React, { useState } from 'react';

export const Edge: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org'); // Default to something that works in iframes often
  const [inputVal, setInputVal] = useState('https://www.wikipedia.org');
  const [iframeKey, setIframeKey] = useState(0);

  const handleGo = (e?: React.FormEvent) => {
    e?.preventDefault();
    let formattedUrl = inputVal;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    setUrl(formattedUrl);
    setIframeKey(prev => prev + 1); // Force reload
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="h-10 bg-[#f3f3f3] flex items-center px-2 gap-2 border-b border-gray-200">
        <div className="flex gap-2 text-gray-500">
          <i className="fa-solid fa-arrow-left hover:bg-gray-200 p-2 rounded-full cursor-pointer text-xs"></i>
          <i className="fa-solid fa-arrow-right hover:bg-gray-200 p-2 rounded-full cursor-pointer text-xs opacity-50"></i>
          <i onClick={() => setIframeKey(prev => prev+1)} className="fa-solid fa-rotate-right hover:bg-gray-200 p-2 rounded-full cursor-pointer text-xs"></i>
        </div>
        
        <form onSubmit={handleGo} className="flex-1 bg-white border border-gray-300 rounded-full h-7 flex items-center px-3 gap-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 ring-blue-100">
          <i className="fa-solid fa-lock text-gray-400 text-xs"></i>
          <input 
            type="text" 
            className="flex-1 outline-none text-xs text-gray-700"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </form>
        
         <div className="flex gap-2 text-gray-500 px-2">
            <i className="fa-regular fa-user hover:bg-gray-200 p-1.5 rounded-full cursor-pointer text-xs"></i>
            <i className="fa-solid fa-ellipsis hover:bg-gray-200 p-1.5 rounded-full cursor-pointer text-xs"></i>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
         <iframe 
            key={iframeKey}
            src={url} 
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Edge Browser"
         />
         
         {/* Overlay hint for iframe issues */}
         <div className="absolute bottom-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 opacity-80 pointer-events-none">
           Note: Some websites block iframes (X-Frame-Options).
         </div>
      </div>
    </div>
  );
};
