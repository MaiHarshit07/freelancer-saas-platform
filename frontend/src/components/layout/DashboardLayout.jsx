import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#07140E]">

      {/* Sidebar */}
     <aside className="hidden lg:flex  flex-shrink-0 border-r border-[#22362B]">
        <Sidebar />
      </aside>

      {/* Main Section */}
      <div className="flex flex-1 flex-col">

        {/* Sticky Topbar */}
        <header className="sticky top-0 z-40">
          <Topbar />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;