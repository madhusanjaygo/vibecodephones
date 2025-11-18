import React, { useState, useContext } from 'react';
import { SystemContext } from '../../App';

export const Notepad: React.FC = () => {
  const [text, setText] = useState("Welcome to Windows 11 Simulator.\n\nThis is a functional text area.\nYou can type here.");
  const context = useContext(SystemContext);
  const [status, setStatus] = useState('');

  const handleSave = () => {
    if (context) {
      // Simulating save to 'Documents'
      context.createFile(`Note-${Date.now()}.txt`, 'file', 'docs', text);
      setStatus('Saved to Documents!');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-6 flex items-center justify-between px-2 text-[11px] text-gray-700 border-b border-gray-100">
        <div className="flex gap-2">
          <button onClick={handleSave} className="hover:bg-gray-100 px-2 rounded cursor-pointer transition-colors">File (Save)</button>
          <span className="hover:bg-gray-100 px-2 rounded cursor-default">Edit</span>
          <span className="hover:bg-gray-100 px-2 rounded cursor-default">View</span>
        </div>
        {status && <span className="text-green-600 font-medium mr-2">{status}</span>}
      </div>
      <textarea
        className="flex-1 w-full h-full resize-none outline-none p-4 font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="h-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end px-4 text-[10px] text-gray-500">
        UTF-8 | Windows (CRLF)
      </div>
    </div>
  );
};
