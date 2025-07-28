import { useEffect, useState } from "react";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import { forwardRef } from "react";
import { Button as OriginalButton, ButtonProps } from "@heroui/button"; // Import type nếu có
import { useParams } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { addToast } from "@heroui/react";

import { DropdownIcon, LogoutIcon, UserIcon } from "./icons";

import { authService } from "@/services/auth";

// Tạo wrapper component để lọc prop không mong muốn
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ preventFocusOnPress, ...props }, ref) => (
    <OriginalButton {...props} ref={ref} />
  ),
);

Button.displayName = "Button"; // Đặt tên hiển thị cho component

export const AdminNavbar = ({
  isCollapsed,
  onToggleSidebar,
}: {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}) => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, [localStorage.getItem("token")]);

  async function Logout() {
    try {
      await authService.logout();
      addToast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống.",
        color: "success",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <HeroUINavbar className="z-30 shadow-md" maxWidth="full" position="sticky">
      {/* Bên trái: menu + logo */}
      <NavbarContent className="pl-0" justify="start">
        <Button
          aria-label="Toggle sidebar"
          className="!w-10 !h-10 !min-w-0 !p-0 bg-transparent hover:border hover:border-white hover:bg-gray-400 transition-all duration-300 flex items-center justify-center"
          onClick={onToggleSidebar}
        >
          {isCollapsed ? "☰" : "←"}
        </Button>
        <NavbarBrand className="gap-2 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin"
          >
            <p className="font-bold text-2xl text-inherit font-gilroy">
              Xuân Hương Admin Site
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Bên phải: user dropdown */}
      <NavbarContent justify="end">
        {localStorage.getItem("token") != null ? (
          <Dropdown>
            <DropdownTrigger>
              <Button
                as={Link}
                className="text-sm font-normal font-gilroy text-default-600 bg-default-100 border-solid border-2 border-zinc-400"
                endContent={<DropdownIcon />}
                id="user-button"
                startContent={<UserIcon />}
                variant="flat"
              >
                Chào, {localStorage.getItem("name")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with icons"
              className="shadow-xl"
              variant="bordered"
            >
              <DropdownSection showDivider aria-label="Profile & Actions">
                <DropdownItem
                  key="info"
                  className="font-gilroy"
                  href="/user/me"
                  startContent={<UserIcon />}
                >
                  Thông tin cá nhân
                </DropdownItem>
              </DropdownSection>
              <DropdownItem
                key="logout"
                className="text-danger font-gilroy"
                color="danger"
                startContent={<LogoutIcon />}
                onClick={Logout}
              >
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </NavbarContent>
    </HeroUINavbar>
  );
};
