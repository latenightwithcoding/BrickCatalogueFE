import { Link } from "@heroui/link";
import { useParams, useLocation } from "react-router-dom";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

export const AdminSidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={clsx(
        "h-screen bg-white shadow-lg transition-all duration-300 overflow-hidden z-0",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div className="flex flex-col gap-2 p-2">
        {siteConfig.navAdminMenuItems.map((item, idx) => {

          // So sánh đường dẫn hiện tại với itemHref
          const isActive = currentPath === item.href;

          return (
            <Link
              key={idx}
              className={clsx(
                "flex items-center gap-3 p-2 rounded-md font-gilroy hover:bg-gray-300 hover:text-gray-900 transition-colors text-gray-700",
                isCollapsed && "justify-center",
                isActive && "bg-primary text-white font-semibold", // Class đánh dấu active
              )}
              href={item.href}
            >
              {item.icon && <item.icon className="w-6 h-6" />}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
