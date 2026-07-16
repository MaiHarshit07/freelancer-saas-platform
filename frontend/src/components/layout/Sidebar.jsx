import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFolderOpen,
  FaBriefcase,
  FaComments,
  FaBell,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaFolderOpen />,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <FaBriefcase />,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <FaComments />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-[#22362B] bg-[#102018]">

      <div className="border-b border-[#22362B] p-6">

        <h1 className="text-2xl font-bold text-[#D4AF37]">
          FreelancerOS
        </h1>

      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-4
              rounded-xl
              px-4
              py-3
              transition

              ${
                isActive
                  ? "bg-[#1A3023] text-[#D4AF37]"
                  : "text-[#C7D2CC] hover:bg-[#16281F] hover:text-white"
              }
              `
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            {item.name}

          </NavLink>

        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;