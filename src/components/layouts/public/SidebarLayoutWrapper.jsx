"use client";
import { useSidebar } from './SidebarProvider';

export function SidebarLayoutWrapper({ children }) {
  const { isOpen } = useSidebar();
  
  return (
    <div 
      className={`
        transition-all duration-300 ease-in-out
        ${isOpen ? 'md:ml-48' : 'md:ml-0'}
      `}
    >
      {children}
    </div>
  );
}