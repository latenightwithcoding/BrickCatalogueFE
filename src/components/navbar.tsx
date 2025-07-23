import { categoryServices } from "@/services/category";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SepNavbarItem from "./sepItem";
import { SubNavbar } from "./subNavbar";
import { debounce } from "lodash";

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

  const initialX = useMotionValue(1000); // mặc định

  const estimateX = () => {
    const width = window.innerWidth;
    const ratio = window.devicePixelRatio;

    // Hệ số điều chỉnh dựa vào mật độ điểm ảnh (tùy chọn, có thể tinh chỉnh thêm)
    const ratioScale = Math.min(ratio, 2); // hạn chế ảnh hưởng quá lớn khi ratio > 2

    const calculateRange = (
      w: number,
      minW: number,
      maxW: number,
      minX: number,
      maxX: number
    ) => {
      const percent = (w - minW) / (maxW - minW);
      return minX + percent * (maxX - minX);
    };

    if (width < 1530) return 150 * ratioScale;

    if (width <= 1920) return calculateRange(width, 1530, 1920, 150, 500) * ratioScale;

    if (width <= 2560) return calculateRange(width, 1920, 2560, 500, 700) * ratioScale;

    if (width <= 3840) return calculateRange(width, 2560, 3840, 700, 900) * ratioScale;

    if (width <= 5120) return calculateRange(width, 3840, 5120, 900, 1100) * ratioScale;

    if (width <= 7680) return calculateRange(width, 5120, 7680, 1100, 1300) * ratioScale;

    return 1300 * ratioScale; // max cho 8K+
  };



  const getSmartCalculatedX = (
    firstItemRef: React.RefObject<HTMLElement>,
    needShift = false
  ) => {
    const OFFSET = 40;
    const MENU_SHIFT = needShift ? 120 : 0;

    const fallback = estimateX() - OFFSET - MENU_SHIFT;

    console.log("📐 Estimate X:", estimateX());

    if (!firstItemRef.current) {
      console.warn("⚠️ Fallback to estimateX (no DOM)");
      return fallback;
    }

    const rect = firstItemRef.current.getBoundingClientRect();
    const result = rect.left - OFFSET - MENU_SHIFT;

    // Nếu quá gần mép trái, dùng estimate
    if (rect.left < 80) return fallback;

    console.log("📐 DOM-based X:", {
      rectLeft: rect.left,
      result,
    });

    return result;
  };


  useEffect(() => {
    const handleResize = debounce(() => {
      const needShift = scrollY.get() > 0;
      const x = getSmartCalculatedX(firstItemRef, needShift);
      const windowWidth = window.innerWidth;

      let forceStatic = false;
      let forceMobile = windowWidth < 1220;

      if (logoRef.current) {
        const logoRight = logoRef.current.getBoundingClientRect().right;
        const diff = Math.round(x - logoRight);
        console.log("📏 Logo Right:", logoRight, "Diff:", diff);

        forceStatic = diff < 150;
        forceMobile ||= diff < 20;
      }

      console.log("🌀 Responsive Resize:", { x, forceStatic, forceMobile });

      initialX.set(x);
      setIsStatic(prev => prev !== forceStatic ? forceStatic : prev);
      setIsMobile(prev => prev !== forceMobile ? forceMobile : prev);
    }, 100); // debounce hợp lý hơn: 100ms

    handleResize(); // Init
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel?.();
    };
  }, [category, scrollY]);




  const left = useTransform(progress, [0, 1], [initialX.get(), 0]);
  const top = useTransform(progress, [0, 1], [20, 0]);
  const height = useTransform(progress, [0, 1], [80, 64]);

  const logoLeft = useTransform(progress, [0, 1], [100, 60]);
  const logoTop = useTransform(progress, [0, 1], [30, 5]);
  const logoScale = useTransform(progress, [0, 1], [1.8, 1]);
  const logoZ = useTransform(progress, [0, 1], [120, 101]);

  const menuRight = useTransform(progress, [0, 1], [130, 40]);
  const flexGrow = useTransform(progress, [0, 1], [0, 1]);
  const subNavbarTop = useTransform([height, top], ([h, t]) => h + t);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMobileParent, setActiveMobileParent] = useState < number | null > (null);
  const firstItemRef = useRef < HTMLElement | null > (null);
  const logoRef = useRef < HTMLDivElement | null > (null);



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
            ref={logoRef}
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
            {isStatic && (
              <div className="absolute w-[450px] h-[150px] bg-white opacity-55 blur-[70px] rounded-full -z-10" />
            )}

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
            ref={logoRef}
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
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed top-0 left-0 w-screen h-screen bg-white z-[9999] p-6 overflow-auto"
                    >
                      {/* Nút đóng */}
                      <div className="flex justify-end mb-6 mr-4 items-center">
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
                          className="block w-full text-left text-gilroy text-black text-xl font-semibold py-2 px-4"
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
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                style={{
                  flexGrow: flexGrow,
                }}
                className="flex items-center gap-4"
              >
                {category.length > 0 && (
                  <>
                    <SepNavbarItem className={`${isStatic ? "text-md" : "text-lg"} font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition`} innerRef={(el) => {
                      if (el && !firstItemRef.current) {
                        firstItemRef.current = el;
                      }
                    }}>
                      Giới thiệu
                    </SepNavbarItem>
                    {category.map((cat) => (
                      <SepNavbarItem
                        className={`${isStatic ? "text-md" : "text-lg"} font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition`}
                        key={cat.id}
                        innerRef={(el) => {
                          if (cat.id === activeCategory?.id) setAnchorRef(el);
                        }}
                        onMouseEnter={() => {
                          setActiveCategory(cat);
                          handleMouseEnter();
                        }}
                        href={cat.child.length === 0 ? `/category/${cat.id}` : undefined}
                      >
                        {cat.name}
                      </SepNavbarItem>
                    ))}
                    <SepNavbarItem
                      className={`${isStatic ? "text-md" : "text-lg"} font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition`}
                      isLast
                    >
                      Liên hệ
                    </SepNavbarItem>
                  </>
                )}
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
              top: isStatic ? 72 : subNavbarTop,
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
