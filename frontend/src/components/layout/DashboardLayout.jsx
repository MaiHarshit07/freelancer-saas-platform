import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  return (
    <div className="h-screen bg-[#07140E] flex overflow-hidden">

      {/* Sidebar */}

      <aside className="w-72 shrink-0 border-r border-[#22362B]">
        <Sidebar />
      </aside>

      {/* Main */}

      <div className="flex flex-1 flex-col">

        {/* Topbar */}

        <header className="sticky top-0 z-40">
          <Topbar />
        </header>

        {/* Scroll Area */}

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;