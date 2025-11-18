import { AppConfig } from './types';
import { Notepad } from './components/apps/Notepad';
import { Calculator } from './components/apps/Calculator';
import { Edge } from './components/apps/Edge';
import { VSCode } from './components/apps/VSCode';
import { Explorer } from './components/apps/Explorer';

export const APPS: Record<string, AppConfig> = {
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    iconClass: 'fa-solid fa-note-sticky',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/notepad.png',
    color: 'text-blue-400',
    component: Notepad,
    defaultWidth: 600,
    defaultHeight: 400
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    iconClass: 'fa-solid fa-calculator',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/calculator.png',
    color: 'text-orange-400',
    component: Calculator,
    defaultWidth: 320,
    defaultHeight: 480
  },
  edge: {
    id: 'edge',
    title: 'Edge',
    iconClass: 'fa-brands fa-edge',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/edge.png',
    color: 'text-green-500',
    component: Edge,
    defaultWidth: 900,
    defaultHeight: 600
  },
  vscode: {
    id: 'vscode',
    title: 'VS Code',
    iconClass: 'fa-solid fa-code',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/vscode.png',
    color: 'text-blue-500',
    component: VSCode,
    defaultWidth: 1000,
    defaultHeight: 700
  },
  explorer: {
    id: 'explorer',
    title: 'File Explorer',
    iconClass: 'fa-solid fa-folder-open',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/explorer.png',
    color: 'text-yellow-500',
    component: Explorer,
    defaultWidth: 800,
    defaultHeight: 500
  },
  trash: {
    id: 'trash',
    title: 'Recycle Bin',
    iconClass: 'fa-solid fa-trash-can',
    iconUrl: 'https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/bin0.png',
    color: 'text-gray-500',
    component: Explorer, // Reuses Explorer with 'trash' appId logic
    defaultWidth: 800,
    defaultHeight: 500
  }
};