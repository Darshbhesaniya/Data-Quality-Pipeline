import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

 const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Each page reads openSidebar via useOutletContext() and passes it to <Topbar onMenuClick={...} /> */}
          <Outlet context={{ openSidebar: () => setSidebarOpen(true) }} />
        </div>
      </main>
    </div>
  );
}

export default Layout