import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@heroui/react";
import Lenis from "@studio-freight/lenis";
import { useParams } from "react-router-dom";
import { Divider } from "@heroui/divider";

import { ProductDetailModel, productServices } from "@/services/product";
import ImagePreview from "@/components/ImagePreview";
import DefaultLayout from "@/layouts/default";
import { ProductCard } from "@/components/productCard";
import parse from "html-react-parser";

export default function ProductDetail() {
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [isStatic, setIsStatic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isWrap, setIsWrap] = useState(false);
  const [data, setData] = useState < ProductDetailModel | null > (null);
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
        scale = 0.4;
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
          const product = await productServices.getProduct(id);

          console.log("Product data:", product);
          setData(product);
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
              className="relative flex h-[500px] sm:h-[350px] md:h-[450px] w-full items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              style={{
                backgroundImage:
                  "url('" + (data?.images[0] || "/images/1.jpg") + "')",
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
                    "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #dbeafe 100%)",
                  pointerEvents: "none",
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                {/* Title */}
                <motion.h1
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-gilroy font-extrabold text-transparent stroke-text text-[1.8rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl`}
                  initial={{ opacity: 0, y: 50 }}
                  style={{
                    transform: `scale(${fontScale + (isMobile ? 0.75 : 0)})`,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  THÔNG TIN CHI TIẾT
                </motion.h1>
              </div>
            </motion.section>
            <div className="flex flex-col mx-auto bg-gradient-to-b from-blue-100 to-white p-4 gap-4 rounded-lg ">
              <section className="relative flex flex-col items-center justify-center py-10">
                <div className="max-w-4xl w-full px-4">
                  <h2
                    className={`text-center mb-6 font-gilroy font-extrabold text-[#34688fce]`}
                    style={{
                      fontSize: `${isMobile ? "1rem" : "2rem"}`,
                      transform: `scale(${fontScale + (isMobile ? 1 : 0)})`,
                    }}
                  >
                    TÊN SẢN PHẨM
                  </h2>
                  <h2
                    className={`text-center w-full line-clamp-4 mb-6 font-gilroy font-extrabold text-[#34688f75]`}
                    style={{
                      fontSize: `${isMobile ? "2rem" : "4rem"}`,
                      transform: `scale(${fontScale + (isMobile ? 0.5 : 0)})`,
                    }}
                  >
                    {data?.name.toUpperCase() ?? ""}
                  </h2>
                  {/* Nội dung danh mục sản phẩm sẽ được thêm vào đây */}
                </div>
              </section>
              {data != null ? (
                <section className="flex justify-center items-center mb-4">
                  <ImagePreview thumbnails={data?.images ?? []} />
                </section>
              ) : (
                <section className="flex justify-center items-center max-w-4xl">
                  <p>Không có sản phẩm nào</p>
                </section>
              )}
            </div>
            <section className="flex flex-col items-center justify-center py-10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center w-full lg:px-4 px-0 gap-4">
                <div className="flex-1">
                  <h2
                    className={`text-center mb-2 font-gilroy text-[#0f5b96]`}
                    style={{
                      fontSize: `${isMobile ? "0.7rem" : "1rem"}`,
                      transform: `scale(${fontScale + (isMobile ? 1 : 0)})`,
                    }}
                  >
                    MÃ SẢN PHẨM
                  </h2>
                  <p
                    className="text-center text-gray-700 font-extrabold w-full"
                    style={{
                      fontSize: "3rem",
                      transform: `scale(${fontScale + (isMobile ? 0.2 : 0)})`,
                    }}
                  >
                    {data?.sku.toUpperCase() ?? "Không có mã sản phẩm."}
                  </p>
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-center mb-2 font-gilroy text-[#0f5b96]`}
                    style={{
                      fontSize: `${isMobile ? "0.7rem" : "1rem"}`,
                      transform: `scale(${fontScale + (isMobile ? 1 : 0)})`,
                    }}
                  >
                    KÍCH THƯỚC
                  </h2>
                  <p
                    className="text-center text-gray-700 font-extrabold"
                    style={{
                      fontSize: "3rem",
                      transform: `scale(${fontScale + (isMobile ? 0.2 : 0)})`,
                    }}
                  >
                    {data?.size} {data?.sizeUnit}
                  </p>
                </div>
              </div>
              <Divider className="my-6 w-4/5 md:w-full" />
              <div className="w-full flex flex-col items-center">
                <h2
                  className={`text-center mb-1 md:mb-2 font-gilroy text-[#0f5b96]`}
                  style={{
                    fontSize: `${isMobile ? "0.7rem" : "1rem"}`,
                    transform: `scale(${fontScale + (isMobile ? 1 : 0)})`,
                  }}
                >
                  MÔ TẢ SẢN PHẨM
                </h2>
                <p
                  className="text-center text-gray-700 font-extrabold"
                  style={{
                    fontSize: "2.5rem",
                    transform: `scale(${fontScale + (isMobile ? 0.1 : 0)})`,
                  }}
                >
                  {parse(data?.description ?? "Không có mô tả cho sản phẩm này.")}
                </p>
              </div>
            </section>
            <section className="flex flex-col items-center justify-center py-12 max-w-4xl mx-auto">
              <h2
                className="text-center mb-4 font-gilroy font-extrabold text-[#34688fce]"
                style={{
                  fontSize: isMobile ? "1rem" : "2rem",
                  transform: `scale(${fontScale + (isMobile ? 0.7 : 0)})`,
                }}
              >
                SẢN PHẨM CÙNG DANH MỤC
              </h2>

              {data?.relatedProducts && data.relatedProducts.length > 0 ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[300px] w-[250px] sm:w-[600px] md:w-[750px] lg:w-[1100px] xl:w-[1250px] px-6">
                  {data.relatedProducts.map((p, index) => (
                    <ProductCard
                      key={index}
                      id={p.id}
                      images={p.images}
                      sku={p.sku}
                    />
                  ))}
                </section>
              ) : (
                <section className="flex justify-center items-center w-full min-h-[100px]">
                  <p>Không có sản phẩm nào</p>
                </section>
              )}
            </section>
          </div>
        </DefaultLayout>
      )}
    </>
  );
}
