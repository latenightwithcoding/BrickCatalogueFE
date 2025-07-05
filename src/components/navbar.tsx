import { categoryServices } from "@/services/category";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SepNavbarItem from "./sepItem";
import { SubNavbar } from "./subNavbar";

export const Navbar = () => {
  const ref = useRef(null);
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSub, setShowSub] = useState(false);
  const timeoutRef = useRef < NodeJS.Timeout | null > (null);
  const [subLeft, setSubLeft] = useState(0);
  const [subWidth, setSubWidth] = useState(0);
  const [anchorRef, setAnchorRef] = useState < HTMLElement | null > (null);


  const { scrollY } = useScroll();

  const borderRadius = useTransform(scrollY, [0, 60], [40, 0]);
  const bg = useTransform(scrollY, [0, 80], ["rgba(255, 255, 255, 0.644)", "#ffffff88"]);
  const boxShadow = useTransform(scrollY, [0, 80], [
    "0 8px 32px rgba(0,0,0,0.12)",
    "0 2px 12px rgba(0, 0, 0, 0.199)",
  ]);
  const left = useTransform(scrollY, [0, 80], [650, 0]);
  const top = useTransform(scrollY, [0, 80], [20, 0]); // <- top navbar
  const height = useTransform(scrollY, [0, 80], [80, 64]);

  const logoLeft = useTransform(scrollY, [0, 80], [80, 40]);
  const logoTop = useTransform(scrollY, [0, 80], [30, 5]);
  const logoScale = useTransform(scrollY, [0, 80], [1.4, 1]);
  const logoZ = useTransform(scrollY, [0, 80], [120, 101]);

  const menuRight = useTransform(scrollY, [0, 80], [150, 90]);
  const subNavbarTop = useTransform([height, top], ([h, t]) => h + t); // 64 is the height of the Navbar

  // convert motion value `top` -> number for SubNavbar
  const [navbarTopValue, setNavbarTopValue] = useState(0);
  useEffect(() => {
    return top.on("change", (val) => setNavbarTopValue(val));
  }, [top]);

  useEffect(() => {
    if (anchorRef) {
      const rect = anchorRef.getBoundingClientRect();
      const left = rect.left;
      const maxWidth = window.innerWidth - left;

      setSubLeft(left);
      setSubWidth(maxWidth);
    }
  }, [anchorRef, showSub]);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoryServices.getAll();
        if (response) {
          setCategory(response);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowSub(false), 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowSub(true);
  };

  return (
    <div ref={ref} style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
      {/* Vùng chứa navbar + submenu: dùng để bắt hover tổng */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Logo */}
        <motion.div
          style={{
            position: "absolute",
            left: logoLeft,
            top: logoTop,
            scale: logoScale,
            zIndex: logoZ,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            height: 48,
          }}
        >
          <p className="text-3xl">Xuân Hương</p>
        </motion.div>

        {/* Nền */}
        <motion.div
          style={{
            position: "absolute",
            top,
            left,
            right: 0,
            height,
            pointerEvents: "auto",
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            backgroundColor: bg,
            backdropFilter: "blur(8px)",
            boxShadow: boxShadow,
            zIndex: 1,
          }}
        />

        {/* Danh mục */}
        <motion.div
          style={{
            position: "absolute",
            top,
            right: menuRight,
            height,
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            pointerEvents: "auto",
            zIndex: 2,
          }}
        >
          <div className="w-full flex items-center gap-4">
            <motion.div
              style={{
                flexGrow: useTransform(scrollY, [0, 80], [0, 1]),
              }}
              className="flex items-center gap-4"
            >
              <SepNavbarItem>Giới thiệu</SepNavbarItem>
              {category.map((cat) => (
                <SepNavbarItem
                  key={cat.id}
                  innerRef={(el) => {
                    if (cat.id === activeCategory?.id) setAnchorRef(el);
                  }}
                  onMouseEnter={() => {
                    setActiveCategory(cat);
                    handleMouseEnter();
                  }}
                >
                  {cat.name}
                </SepNavbarItem>
              ))}
              <SepNavbarItem isLast>Liên hệ</SepNavbarItem>
            </motion.div>
          </div>
        </motion.div>

        {/* SubNavbar nằm dưới Navbar */}
        {showSub && activeCategory?.child?.length > 0 && (
          <motion.div
            style={{
              position: "fixed",
              top: subNavbarTop,
              left: subLeft,
              maxWidth: subWidth,
              zIndex: 40,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SubNavbar category={activeCategory.child} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
