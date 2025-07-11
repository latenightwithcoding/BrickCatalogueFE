import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Slider } from "@/components/slider";
import {
  motion, useScroll, useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useScrollTrigger } from "../components/scrollTrigger";

const getAverageColor = (img: HTMLImageElement): Promise<{ r: number; g: number; b: number }> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve({ r: 255, g: 255, b: 255 });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    resolve({ r: r / count, g: g / count, b: b / count });
  });
};

const isDark = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 131;
};

const analyzeImages = async (urls: string[]) => {
  const results: { url: string; textColor: "text-white" | "text-[#527aaf]" }[] = [];

  for (const url of urls) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    await new Promise < void> ((resolve) => {
      img.onload = async () => {
        const avgColor = await getAverageColor(img);
        const textColor = isDark(avgColor) ? "text-white" : "text-[#527aaf]";
        results.push({ url, textColor });
        resolve();
      };
      img.onerror = () => {
        // fallback nếu lỗi
        results.push({ url, textColor: "text-white" });
        resolve();
      };
    });
  }
  console.log("Analyzed images:", results);
  return results;
};

export default function IndexPage() {
  const scrollRef = useRef(null);
  const titleText = "XUÂN HƯƠNG - HỆ SINH THÁI VẬT LIỆU XANH, ĐỒNG BỘ CHO MỌI CÔNG TRÌNH";
  const brandText = "THƯƠNG HIỆU";
  const brandingText = "XUÂN HƯƠNG";
  const words = titleText.split(" ");
  const brandWords = brandText.split(" ");
  const brandingWords = brandingText.split(" ");
  const image = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"];
  const { ref: brandRef, show: brandShow } = useScrollTrigger(0.3);
  const { ref: brandingRef, show: brandingShow } = useScrollTrigger(0.3, true);
  const { ref: brandingRef_1, show: brandingShow_1 } = useScrollTrigger(0.3, true);
  const { ref: introductionRef, show: introductionShow } = useScrollTrigger(0.3);

  const [slides, setSlides] = useState < { url: string; textColor: "text-white" | "text-[#527aaf]" }[] > ([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    analyzeImages(image).then((data) => setSlides(data));
  }, []);

  useEffect(() => {
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

  return (
    <DefaultLayout>
      <div ref={scrollRef}>
        <section className="relative min-h-screen flex">
          {/* <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${image[0]})`,
            }}
          /> */}
          {slides.length > 0 && (
            <>
              <Slider
                images={slides.map((slide) => slide.url)}
                onSlideChange={(index) => setCurrentIndex(index)}
              />
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.07 } }, // delay giữa các chữ
                }}
                className="absolute left-48 h-fit bottom-14 z-10 line-clamp-2"
              >
                <p className={`font-gilroy font-bold text-shadow text-5xl ${slides[currentIndex]?.textColor} flex flex-wrap gap-x-4`}>
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </motion.div>

            </>
          )}

        </section>

        <section
          ref={brandRef}
          className="flex items-center justify-center gap-4 py-8 md:py-10"
        >
          {brandWords.map((word, index) => (
            <motion.span
              key={index}
              className={`font-gilroy font-extrabold text-8xl text-[#CEDBEB]`}
              initial={{ opacity: 0, y: 20 }}
              animate={brandShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.2, duration: 0.4 }}
            >
              {word}
            </motion.span>
          ))}
        </section>
        <section className="relative w-full overflow-hidden mt-6">
          {/* Vùng nền bo cong bên trái */}
          <div className="absolute inset-0 flex justify-start">
            <div className="w-[60%] h-full rounded-r-[500px] bg-gradient-to-b from-[#d3e3ed] to-[#d3e3ed00] " />
          </div>

          {/* Nội dung nằm bên trong vùng xanh */}
          <div ref={brandingRef} className="relative z-10 w-[60%] pl-52 pr-36 py-8 md:py-10 text-center">
            <motion.div
              initial="hidden"
              animate={brandingShow ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="mb-4"
            >
              {brandingWords.map((word, index) => (
                <motion.span
                  key={index}
                  className="text-4xl md:text-5xl font-extrabold text-[#0f5b96] mr-4 inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <h3 className="text-lg md:text-xl font-bold mt-4">NÂNG TẦM PHONG CÁCH SỐNG</h3>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Với hơn 50 năm kinh nghiệm, <strong>Xuân Hương</strong> tự hào là người sáng lập nên ngành công nghiệp sản
              xuất vật liệu xây dựng tại Việt Nam. Bằng việc tiên phong trong sản xuất các dòng sản phẩm
              gạch ốp lát cao cấp, <strong>Xuân Hương</strong> đã góp phần nâng tầm phong cách sống cho các dự án, công trình.
            </p>
            <div className="flex items-center justify-center">
              <button className="w-fit mt-8 px-6 py-3 border border-[#0f5b96] rounded-full text-[#0f5b96] font-bold hover:bg-[#0f5b96] hover:text-white transition flex items-center gap-2">
                XEM THÊM
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </section>

        <section className="relative w-full overflow-hidden mt-6">
          {/* Vùng nền bo cong bên trái */}
          <div className="absolute inset-0 flex justify-end">
            <div className="w-[60%] h-full rounded-l-[500px] bg-gradient-to-b from-[#d3e3ed] to-[#d3e3ed00] " />
          </div>

          {/* Nội dung nằm bên trong vùng xanh (bên phải) */}
          <div ref={brandingRef_1} className="relative z-10 w-[60%] ml-auto pr-52 pl-36 py-20 text-center">
            <motion.div
              initial="hidden"
              animate={brandingShow_1 ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="mb-4"
            >
              {brandingWords.map((word, index) => (
                <motion.span
                  key={index}
                  className="text-4xl md:text-5xl font-extrabold text-[#0f5b96] mr-4 inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mt-4">NÂNG TẦM PHONG CÁCH SỐNG</h3>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Với hơn 50 năm kinh nghiệm, <strong>Xuân Hương</strong> tự hào là người sáng lập nên ngành công nghiệp sản
              xuất vật liệu xây dựng tại Việt Nam. Bằng việc tiên phong trong sản xuất các dòng sản phẩm
              gạch ốp lát cao cấp, <strong>Xuân Hương</strong> đã góp phần nâng tầm phong cách sống cho các dự án, công trình.
            </p>

            <div className="flex items-center justify-center">
              <button className="w-fit mt-8 px-6 py-3 border border-[#0f5b96] rounded-full text-[#0f5b96] font-bold hover:bg-[#0f5b96] hover:text-white transition flex items-center gap-2">
                XEM THÊM
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </section>


        <section className="flex flex-col items-start px-20 py-8 md:py-10 leading-none">
          <p className="text-9xl font-gilroy font-extrabold text-transparent stroke-text">
            Xuân
          </p>
          <p className="-mt-4 text-[150px] font-gilroy font-extrabold text-white stroke-text">
            Hương
          </p>
        </section>
        <section ref={introductionRef} className="flex flex-col items-center justify-center px-20 gap-4">
          <motion.p
            className={`font-gilroy text-lg text-black`}
            initial={{ opacity: 0, y: 20 }}
            animate={introductionShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            Lorem ipsum dolor sit amet. Sit recusandae error et ratione galisum est fuga laborum sit voluptatem eius qui autem perferendis aut deleniti nostrum rem expedita Quis. Sed cumque repudiandae hic cupiditate ipsa aut consequatur esse vel harum autem. Aut sunt suscipit ea consequatur architecto aut atque commodi est quos minima. Qui quasi voluptates id ipsam enim qui molestiae error. Aut fuga nihil et doloremque inventore id aliquid magni qui totam repellat. Eos molestiae ratione et itaque sint ab animi enim et dolorem dicta et esse voluptatem ea eveniet quae eos soluta omnis. Eos quia perspiciatis ut cupiditate officia ut enim molestiae sed illum nihil ut ipsum blanditiis est quia numquam est omnis galisum. Aut perferendis officia ea deserunt culpa id cumque accusantium eos omnis natus sed expedita fuga quo culpa voluptate? Quo ratione tempore aut assumenda praesentium est quis ipsam ut deserunt recusandae ex labore odio.
          </motion.p>
        </section>
      </div>
    </DefaultLayout>
  );
}
