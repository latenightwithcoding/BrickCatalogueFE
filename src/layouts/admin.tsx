import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import { AdminNavbar } from "@/components/admin-navbar";
import { AdminSidebar } from "@/components/admin-sidebar";

// Key lưu trữ localStorage
const STORAGE_KEY = "adminSidebarCollapsed";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Khởi tạo state từ localStorage (chỉ chạy 1 lần khi mount)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false; // Server-side fallback
    const savedState = localStorage.getItem(STORAGE_KEY);

    return savedState ? JSON.parse(savedState) : false;
  });

  // Cập nhật localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Lắng nghe thay đổi từ các tab khác hoặc từ bên ngoài
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setSidebarCollapsed(e.newValue ? JSON.parse(e.newValue) : false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Tối ưu hàm toggle với useCallback
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev: boolean) => !prev);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      {" "}
      {/* <-- dùng min-h-screen */}
      <AdminNavbar
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex flex-row flex-1">
        {" "}
        {/* <-- bỏ h-screen ở đây */}
        <div className="fixed top-16 left-0 z-0">
          <AdminSidebar isCollapsed={isSidebarCollapsed} />
        </div>
        <main
          className={clsx(
            "w-full pt-2 transition-all duration-300 pr-16",
            isSidebarCollapsed ? "pl-[100px]" : "pl-72",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
