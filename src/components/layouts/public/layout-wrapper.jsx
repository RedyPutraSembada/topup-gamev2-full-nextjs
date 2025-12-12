"use client";
import { useState } from "react";
import Header from "@/components/layouts/public/site-header";
import Sidebar from "@/components/layouts/public/site-sidebar";
import Footer from "@/components/layouts/public/site-footer";
import { BottomNavigator } from "@/components/layouts/public/bottom-navigator";

export default function LayoutWrapper({ children, dataLogo }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar 
        dataLogo={dataLogo} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="lg:ml-48">
        <Header 
          dataLogo={dataLogo}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex flex-1 flex-col">
          {children}
        </main>
        
        <Footer dataLogo={dataLogo} />
        <BottomNavigator/>
      </div>
      
      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}