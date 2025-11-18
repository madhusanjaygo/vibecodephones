import React from 'react';

export type AppID = 'notepad' | 'calculator' | 'edge' | 'vscode' | 'trash' | 'explorer';

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface AppConfig {
  id: AppID;
  title: string;
  iconClass: string; 
  iconUrl: string;
  color: string;
  component: React.FC<{ windowId: string }>;
  defaultWidth: number;
  defaultHeight: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  parentId: string | null;
  iconClass?: string;
  iconColor?: string;
}

export interface SystemContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  files: FileNode[];
  wallpaperUrl: string;
  toggleStartMenu: () => void;
  openApp: (appId: AppID, initialPath?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  changeWallpaper: (url?: string) => void;
  
  // File System Operations
  createFile: (name: string, type: 'folder'|'file', parentId: string, content?: string) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, content: string) => void;
}