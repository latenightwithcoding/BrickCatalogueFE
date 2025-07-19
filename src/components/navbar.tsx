import { categoryServices } from "@/services/category";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  const [isStatic, setIsStatic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 200, damping: 30 });
  const progress = useTransform(smoothScroll, [0, 48], [0, 1]); // clamp trong khoảng 0–80px

  // const borderRadius = useTransform(scrollY, [0, 60], [40, 0]);
  // const bg = useTransform(scrollY, [0, 80], ["rgba(255, 255, 255, 0.644)", "#ffffff88"]);
  // const boxShadow = useTransform(scrollY, [0, 80], [
  //   "0 8px 32px rgba(0,0,0,0.12)",
  //   "0 2px 12px rgba(0, 0, 0, 0.199)",
  // ]);
  // const left = useTransform(scrollY, [0, 80], [650, 0]);
  // const top = useTransform(scrollY, [0, 80], [20, 0]); // <- top navbar
  // const height = useTransform(scrollY, [0, 80], [80, 64]);

  // const logoLeft = useTransform(scrollY, [0, 80], [100, 60]);
  // const logoTop = useTransform(scrollY, [0, 80], [30, 5]);
  // const logoScale = useTransform(scrollY, [0, 80], [1.4, 1]);
  // const logoZ = useTransform(scrollY, [0, 80], [120, 101]);

  // const menuRight = useTransform(scrollY, [0, 80], [60, 40]);
  // const subNavbarTop = useTransform([height, top], ([h, t]) => h + t); // 64 is the height of the Navbar


  const borderRadius = useTransform(progress, [0, 1], [40, 0]);
  const bg = useTransform(progress, [0, 1], ["rgba(255, 255, 255, 0.644)", "#ffffff88"]);
  const boxShadow = useTransform(progress, [0, 1], [
    "0 8px 32px rgba(0,0,0,0.12)",
    "0 2px 12px rgba(0, 0, 0, 0.199)",
  ]);

  const [initialX, setInitialX] = useState(650); // mặc định

  useEffect(() => {
    const handleResize = () => {
      const x = getResponsiveX();
      console.log("window.innerWidth:", window.innerWidth);
      console.log("devicePixelRatio:", window.devicePixelRatio); // ✅ Log kiểm tra
      setInitialX(x);
      setIsStatic(window.innerWidth < 1530); // Cập nhật trạng thái isStatic
      setIsMobile(window.innerWidth < 1220); // Cập nhật trạng thái isMobile
    };

    const getResponsiveX = () => {
      const width = window.innerWidth;
      const ratio = window.devicePixelRatio;

      if (width >= 1530 && width <= 1920) {
        const min = 1530;
        const max = 1920;
        const minX = 150;
        const maxX = 500;

        const t = (width - min) / (max - min);
        return minX + t * (maxX - minX);
      }

      if (ratio > 1 || (width < 1530 && ratio === 2)) return 150;
      return 500;
    };

    handleResize(); // ✅ Kiểm tra ban đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const left = useTransform(progress, [0, 1], [initialX, 0]);
  const top = useTransform(progress, [0, 1], [20, 0]);
  const height = useTransform(progress, [0, 1], [80, 64]);

  const logoLeft = useTransform(progress, [0, 1], [100, 60]);
  const logoTop = useTransform(progress, [0, 1], [30, 5]);
  const logoScale = useTransform(progress, [0, 1], [1.8, 1]);
  const logoZ = useTransform(progress, [0, 1], [120, 101]);

  const menuRight = useTransform(progress, [0, 1], [160, 40]);
  const flexGrow = useTransform(progress, [0, 1], [0, 1]);
  const subNavbarTop = useTransform([height, top], ([h, t]) => h + t);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMobileParent, setActiveMobileParent] = useState < number | null > (null);



  useEffect(() => {
    if (anchorRef) {
      const rect = anchorRef.getBoundingClientRect();
      const left = rect.left - 65;
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
    setActiveCategory(null);
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
        {!isStatic ? (
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
            {/* 🔆 Đốm sáng mờ ở nền logo */}
            <div className="absolute w-[450px] h-[150px] bg-white opacity-55 blur-[70px] rounded-full -z-10" />
            {/* 🔤 Chữ logo */}
            <img src="/images/logo.png" alt="Logo" className="relative z-10" style={{
              width: 82,
              height: 82,
              objectFit: "contain",
            }} />
            {/* <span className="font-gilroy font-extrabold text-4xl text-[#527aaf] relative z-10">
            Xuân Hương
          </span> */}
          </motion.div>
        ) : (
          <motion.div
            style={{
              position: "absolute",
              display: "flex",
              left: 35,
              top: 10,
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              height: 48,
            }}
          >
            {/* 🔆 Đốm sáng mờ ở nền logo */}
            <div className="absolute w-[450px] h-[150px] bg-white opacity-55 blur-[70px] rounded-full -z-10" />
            {/* 🔤 Chữ logo */}
            <img src="/images/logo.png" alt="Logo" className="relative z-10" style={{
              width: 82,
              height: 82,
              objectFit: "contain",
            }} />
            {/* <span className="font-gilroy font-extrabold text-4xl text-[#527aaf] relative z-10">
            Xuân Hương
          </span> */}
          </motion.div>
        )}

        {/* Nền */}
        {!isStatic ? (<motion.div
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
        />) : (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 72,
              pointerEvents: "auto",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              backgroundColor: bg,
              backdropFilter: "blur(8px)",
              boxShadow: boxShadow,
              zIndex: 1,
            }}
          />
        )}


        {/* Danh mục */}
        <motion.div
          style={{
            position: "absolute",
            top: isStatic ? 0 : top,
            right: isStatic ? 20 : menuRight,
            height: isStatic ? 72 : height,
            display: "flex",
            alignItems: "center",
            padding: "0",
            pointerEvents: "auto",
            zIndex: 2,
          }}
        >
          <div className="w-full flex items-center gap-4 relative">
            {isMobile ? (
              <>
                {/* Nút Hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-md"
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Danh mục xổ xuống */}
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 w-screen h-screen bg-white z-[9999] p-6 overflow-auto"
                  >
                    {/* Nút đóng */}
                    <div className="flex justify-end mb-4 items-center">
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="text-3xl font-bold text-gray-600 hover:text-black"
                        aria-label="Đóng menu"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Danh mục cha và con */}
                    <div className="space-y-4">
                      {/* Liên hệ */}
                      <a
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full text-left text-gilroy text-gray-700 text-xl font-semibold py-2 px-4"
                      >
                        Giới thiệu
                      </a>
                      {category.map((cat) => (
                        <div key={cat.id}>
                          <button
                            className="w-full text-gilroy text-left text-xl font-semibold text-black py-2 px-4 "
                            onClick={() =>
                              setActiveMobileParent(activeMobileParent === cat.id ? null : cat.id)
                            }
                          >
                            {cat.name}
                          </button>

                          {/* Danh mục con */}
                          {activeMobileParent === cat.id && cat.child?.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                              {cat.child.map((child) => (
                                <a
                                  key={child.id}
                                  href={`/category/${child.id}`}
                                  onClick={() => setMenuOpen(false)}
                                  className="block text-gilroy text-gray-700 py-1 px-4 hover:bg-gray-200 rounded"
                                >
                                  {child.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Liên hệ */}
                      <a
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full text-left text-xl font-semibold py-2 px-4"
                      >
                        Liên hệ
                      </a>
                    </div>
                  </motion.div>
                )}

              </>
            ) : (
              <motion.div
                style={{
                  flexGrow: flexGrow,
                }}
                className="flex items-center gap-4"
              >
                <SepNavbarItem className="text-lg font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition">
                  Giới thiệu
                </SepNavbarItem>
                {category.map((cat) => (
                  <SepNavbarItem
                    className="text-lg font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition"
                    key={cat.id}
                    innerRef={(el) => {
                      if (cat.id === activeCategory?.id) setAnchorRef(el);
                    }}
                    onMouseEnter={() => {
                      setActiveCategory(cat);
                      handleMouseEnter();
                    }}
                    href={`/category/${cat.id}`}
                  >
                    {cat.name}
                  </SepNavbarItem>
                ))}
                <SepNavbarItem
                  className="text-lg font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition"
                  isLast
                >
                  Liên hệ
                </SepNavbarItem>
              </motion.div>
            )}
          </div>
        </motion.div>


        {/* SubNavbar nằm dưới Navbar */}
        {showSub && activeCategory?.child?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
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
