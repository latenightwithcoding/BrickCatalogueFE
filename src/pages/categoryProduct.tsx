import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@heroui/react";
import Lenis from "@studio-freight/lenis";
import { useParams } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { ProductCard } from "@/components/productCard";
import { ProductCardModel, productServices } from "@/services/product";

export default function CategoryProduct() {
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [isStatic, setIsStatic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isWrap, setIsWrap] = useState(false);
  const [data, setData] = useState<ProductCardModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      window.location.href = "/";

      return;
    }
    const lenis = new Lenis({
      lerp: 0.06, // mượt rất nhiều
      wheelMultiplier: 0.5, // giảm tốc độ cuộn
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const ratio = window.devicePixelRatio;
      const width = window.innerWidth;

      setIsStatic(width < 1530);
      setIsMobile(width < 1220);

      // Tính toán tỉ lệ scale cho chữ
      let scale = 1;
      // Nếu độ phân giải cao + màn hình nhỏ thì scale nhỏ hơn

      if (width < 1440) {
        scale = 0.85;
        setIsWrap(true);
      } else if (width < 1600) {
        scale = 0.9;
      } else {
        scale = 0.95;
      }
      console.log("Font scale:", scale);

      setFontScale(scale);
    };

    handleResize(); // ✅ Kiểm tra ban đầu
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (id) {
          const products = await productServices.getProducts(id);

          setData(products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchData();
  }, [id]);

  function getBackdrop(name: string) {
    if (name.toUpperCase().includes("NGÓI")) {
      return "url('/images/ngoi.jpg')";
    } else if (
      name.toUpperCase().includes("GẠCH") &&
      name.match(/\b\d{2,3}\s*x\s*\d{2,3}\b/i)
    ) {
      return "url('/images/gach-men.jpg')";
    } else if (name.toUpperCase().includes("GẠCH")) {
      return "url('/images/gach-san.jpg')";
    } else if (name.toUpperCase().includes("GỐM")) {
      return "url('/images/gom-san-vuon.jpg')";
    } else if (name.toUpperCase().includes("ĐÁ")) {
      return "url('/images/da-soi.jpg')";
    }

    return "url('/images/1.jpg')";
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CircularProgress aria-label="Loading..." size="lg" />
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoading && (
        <DefaultLayout>
          <div ref={scrollRef}>
            <motion.section
              animate={{ opacity: 1 }}
              className={`relative flex ${isMobile ? "h-[300px]" : "h-[500px]"} w-full items-center justify-center overflow-hidden`}
              initial={{ opacity: 0 }}
              style={{
                backgroundImage: getBackdrop(data?.name ?? ""),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#000000",
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-0"
                initial={{ opacity: 0, y: 50 }}
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
                  pointerEvents: "none",
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                {/* Title */}
                <motion.h1
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-gilroy font-extrabold text-transparent stroke-text
              text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl`}
                  initial={{ opacity: 0, y: 50 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {data?.name.toUpperCase()}
                </motion.h1>
              </div>
            </motion.section>
            <section className="relative flex flex-col items-center justify-center py-10">
              <div className="max-w-4xl w-full px-4">
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-gilroy text-lg text-black`}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                >
                  <h2
                    className={`text-center mb-6 font-gilroy font-extrabold text-[#0f5b96]`}
                    style={{
                      fontSize: `${isMobile ? "2rem" : "3rem"}`,
                      transform: `scale(${fontScale})`,
                    }}
                  >
                    SẢN PHẨM
                  </h2>
                </motion.p>
                {data?.products && data.products.length > 0 && (
                  <p className="text-center text-gray-600 mb-8">
                    Khám phá các sản phẩm {data?.name.toLowerCase()} và chất
                    lượng cao của chúng tôi.
                  </p>
                )}
                {/* Nội dung danh mục sản phẩm sẽ được thêm vào đây */}
              </div>
            </section>
            {data?.products && data.products.length > 0 ? (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
                {/* Filter bên trái chiếm 3/12 trên màn lớn */}
                <div
                  className={`lg:col-span-2 w-full ${isStatic ? "max-w-xs" : "max-w-md"}`}
                >
                  <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Loại ngói
                      </label>
                      <select className="w-full p-2 border rounded">
                        <option value="">Tất cả</option>
                        <option value="clay">Ngói đất sét</option>
                        <option value="concrete">Ngói bê tông</option>
                        <option value="metal">Ngói kim loại</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Màu sắc
                      </label>
                      <select className="w-full p-2 border rounded">
                        <option value="">Tất cả</option>
                        <option value="red">Đỏ</option>
                        <option value="black">Đen</option>
                        <option value="green">Xanh lá</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm bên phải chiếm 9/12 */}
                <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data?.products.map((p, index) => (
                    <ProductCard
                      key={index}
                      id={p.id}
                      images={p.images}
                      sku={p.sku}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section className="flex justify-center">
                <p>Không có sản phẩm nào</p>
              </section>
            )}
          </div>
        </DefaultLayout>
      )}
    </>
  );
}
