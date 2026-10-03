import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import {
  clientLinks,
  freelancerLinks,
} from "../../config/sidebarLinks";
import { getUnreadNotificationCount } from "../../services/notificationService";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadNotificationCount();
        setUnreadCount(response.count || 0);
      } catch (error) {
        setUnreadCount(0);
      }
    };

    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const links =
    user?.role === "client"
      ? clientLinks
      : freelancerLinks;

  return (
    <aside className="flex h-full flex-col bg-[#102018]">

      {/* Logo */}

      <div className="border-b border-[#22362B] px-6 py-4">

        <h1 className="text-2xl font-bold tracking-wide text-[#D4AF37]">
          FreelanceOS
        </h1>

       

      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-[#7F8D85]">
          Workspace
        </p>

        <div className="space-y-2">

          {links.map((link) => {

            const Icon = link.icon;
            const showBadge = link.path === "/notifications" && unreadCount > 0;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-lg"
                      : "text-[#C7D2CC] hover:bg-[#1A3023] hover:text-white"
                  }
                `
                }
              >
                <div className="flex items-center gap-4">
                  <Icon size={18} />

                  <span className="font-medium">
                    {link.name}
                  </span>
                </div>

                {showBadge && (
                  <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#D4AF37] px-1.5 py-0.5 text-[10px] font-bold text-black">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}

              </NavLink>
            );
          })}

        </div>

      </div>

      {/* Bottom Profile */}

      <div className="border-t border-[#22362B] p-3">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-lg font-bold text-black">

            {user?.name?.charAt(0).toUpperCase() || "U"}

          </div>

          <div>

            <h3 className="font-semibold text-white">
              {user?.name || "User"}
            </h3>

            <p className="text-sm capitalize text-[#7F8D85]">
              {user?.role}
            </p>

          </div>

        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#22362B]
            py-3
            text-[#C7D2CC]
            transition
            hover:border-red-500
            hover:text-red-400
          "
        >
          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;