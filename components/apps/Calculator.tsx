import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNum, setNewNum] = useState(true);

  const handleNum = (num: string) => {
    if (newNum) {
      setDisplay(num);
      setNewNum(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (operation: string) => {
    setOp(operation);
    setPrevVal(parseFloat(display));
    setNewNum(true);
  };

  const calculate = () => {
    if (op && prevVal !== null) {
      const current = parseFloat(display);
      let res = 0;
      switch (op) {
        case '+': res = prevVal + current; break;
        case '-': res = prevVal - current; break;
        case '*': res = prevVal * current; break;
        case '/': res = prevVal / current; break;
      }
      setDisplay(String(res));
      setPrevVal(null);
      setOp(null);
      setNewNum(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setNewNum(true);
  };

  const btnClass = "flex items-center justify-center rounded hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium";
  const opClass = "flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 active:bg-blue-500 active:text-white transition-colors text-sm font-medium";
  const eqClass = "flex items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm font-medium";

  return (
    <div className="w-full h-full bg-[#f3f3f3] p-1 flex flex-col">
      <div className="h-12 flex items-center px-4 mb-2">
        <i className="fa-solid fa-bars text-gray-500"></i>
        <span className="ml-4 font-medium text-gray-700">Standard</span>
      </div>
      
      <div className="flex-1 flex flex-col items-end justify-end px-4 pb-4">
        <div className="text-4xl font-semibold text-gray-800 truncate w-full text-right">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-1 h-3/5 p-1">
        <button onClick={clear} className={opClass}>CE</button>
        <button onClick={clear} className={opClass}>C</button>
        <button className={opClass}><i className="fa-solid fa-delete-left"></i></button>
        <button onClick={() => handleOp('/')} className={opClass}>÷</button>

        <button onClick={() => handleNum('7')} className={btnClass}>7</button>
        <button onClick={() => handleNum('8')} className={btnClass}>8</button>
        <button onClick={() => handleNum('9')} className={btnClass}>9</button>
        <button onClick={() => handleOp('*')} className={opClass}>×</button>

        <button onClick={() => handleNum('4')} className={btnClass}>4</button>
        <button onClick={() => handleNum('5')} className={btnClass}>5</button>
        <button onClick={() => handleNum('6')} className={btnClass}>6</button>
        <button onClick={() => handleOp('-')} className={opClass}>-</button>

        <button onClick={() => handleNum('1')} className={btnClass}>1</button>
        <button onClick={() => handleNum('2')} className={btnClass}>2</button>
        <button onClick={() => handleNum('3')} className={btnClass}>3</button>
        <button onClick={() => handleOp('+')} className={opClass}>+</button>

        <button onClick={() => handleNum('0')} className="col-span-2 rounded hover:bg-gray-100 flex items-center justify-center">0</button>
        <button onClick={() => handleNum('.')} className={btnClass}>.</button>
        <button onClick={calculate} className={eqClass}>=</button>
      </div>
    </div>
  );
};