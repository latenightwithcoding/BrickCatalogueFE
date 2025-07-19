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
  const titleText = "XUÂN HƯƠNG - NÂNG TẦM KHÔNG GIAN SỐNG CỦA BẠN";
  const subtitleText = "NHẬN THI CÔNG SẮT";
  const brandText = "THƯƠNG HIỆU";
  const brandingText = "XUÂN HƯƠNG";
  const words = titleText.split(" ");
  const subtitleWords = subtitleText.split(" ");
  const brandWords = brandText.split(" ");
  const brandingWords = brandingText.split(" ");
  const image = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg", "/images/5.jpg", "/images/6.jpg", "/images/7.jpg", "/images/8.jpg"];
  const { ref: brandRef, show: brandShow } = useScrollTrigger(0.3);
  const { ref: brandingRef, show: brandingShow } = useScrollTrigger(0.3, true);
  const { ref: brandingRef_1, show: brandingShow_1 } = useScrollTrigger(0.3, true);
  const { ref: introductionRef, show: introductionShow } = useScrollTrigger(0.3);
  const [fontScale, setFontScale] = useState(1);
  const [initialX, setInitialX] = useState(300);
  const [isStatic, setIsStatic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWrap, setIsWrap] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      const ratio = window.devicePixelRatio;
      const width = window.innerWidth;

      setIsStatic(width < 1530);
      setIsMobile(width < 1220);

      // Tính toán tỉ lệ scale cho chữ
      let scale = 1;

      if (ratio > 1) {
        // Nếu độ phân giải cao + màn hình nhỏ thì scale nhỏ hơn
        if (width < 1440) {
          scale = 0.85;
          setIsWrap(true);
        } else if (width < 1600) {
          scale = 0.9;
        } else {
          scale = 0.95;
        }
      }
      console.log("Font scale:", scale);

      setFontScale(scale);
    };

    handleResize(); // ✅ Kiểm tra ban đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
                className="absolute top-1/3 z-10 py-4 left-1/2 text-center"
                style={{
                  transform: `translateX(-50%) scale(${fontScale})`,
                  transformOrigin: "center",
                  maxWidth: isWrap ? "90vw" : "none", // giúp ngắt dòng nếu cần
                }}
              >
                <p
                  className={`
                    font-gilroy font-bold text-shadow text-[clamp(1.5rem,4vw,3.5rem)]
                    ${slides[currentIndex]?.textColor}
                    flex ${isWrap ? "flex-wrap" : ""}
                    justify-center text-center gap-x-3
                    ${isWrap ? "max-h-[10.5em] overflow-hidden" : "whitespace-nowrap"}
                  `}
                >
                  {subtitleWords.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>

              </motion.div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
                className="absolute bottom-14 z-10 py-4 left-1/2 text-center"
                style={{
                  transform: `translateX(-50%) scale(${fontScale})`,
                  transformOrigin: "center",
                  maxWidth: isWrap ? "90vw" : "none", // giúp ngắt dòng nếu cần
                }}
              >
                <p
                  className={`
                    font-gilroy font-bold text-shadow text-[clamp(1.5rem,4vw,3.5rem)]
                    ${slides[currentIndex]?.textColor}
                    flex ${isWrap ? "flex-wrap" : ""}
                    justify-center text-center gap-x-3
                    ${isWrap ? "max-h-[10.5em] overflow-hidden" : "whitespace-nowrap"}
                  `}
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="inline-block"
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
          <div ref={brandingRef} className="relative z-10 w-[60%] pl-48 pr-36 py-8 md:py-10 text-center">
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

            <h3 className="text-lg md:text-xl font-bold mt-4">NÂNG TẦM KHÔNG GIAN SỐNG CỦA BẠN</h3>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Với hành trình hơn hai thập kỷ hình thành và phát triển kể từ năm 2003, VLXD <strong>Xuân Hương</strong> đã trở thành người bạn đồng hành đáng tin cậy của hàng ngàn công trình lớn nhỏ. Chúng tôi không chỉ bán vật liệu xây dựng, chúng tôi mang đến những mảnh ghép hoàn hảo để hoàn thiện vẻ đẹp cho ngôi nhà của bạn. Chúng tôi hiểu rằng mỗi công trình là một tác phẩm nghệ thuật, và vẻ đẹp của nó được tạo nên từ những vật liệu chất lượng nhất.
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
            <h3 className="text-lg md:text-xl font-bold mt-4">THẾ MẠNH</h3>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Thế mạnh của chúng tôi là các sản phẩm trang trí nội ngoại thất tinh tế và đa dạng:
            </p>
            <ul className="list-disc list-inside mt-4 pl-16 text-left">
              <li>Gạch & Đá: Mang đến sự sang trọng và cá tính.</li>
              <li>Ngói & Sỏi: Tạo nên điểm nhấn độc đáo và hài hòa với thiên nhiên.</li>
              <li>Keo dán & chống thấm: Đem lại sự vững chắc an toàn theo thời gian</li>
            </ul>

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
            {/* Lorem ipsum dolor sit amet. Sit recusandae error et ratione galisum est fuga laborum sit voluptatem eius qui autem perferendis aut deleniti nostrum rem expedita Quis. Sed cumque repudiandae hic cupiditate ipsa aut consequatur esse vel harum autem. Aut sunt suscipit ea consequatur architecto aut atque commodi est quos minima. Qui quasi voluptates id ipsam enim qui molestiae error. Aut fuga nihil et doloremque inventore id aliquid magni qui totam repellat. Eos molestiae ratione et itaque sint ab animi enim et dolorem dicta et esse voluptatem ea eveniet quae eos soluta omnis. Eos quia perspiciatis ut cupiditate officia ut enim molestiae sed illum nihil ut ipsum blanditiis est quia numquam est omnis galisum. Aut perferendis officia ea deserunt culpa id cumque accusantium eos omnis natus sed expedita fuga quo culpa voluptate? Quo ratione tempore aut assumenda praesentium est quis ipsam ut deserunt recusandae ex labore odio. */}
            Với phương châm "Lấy uy tín tạo nên thương hiệu", chúng tôi cam kết mang đến cho Quý khách hàng những sản phẩm vượt trội cùng dịch vụ tư vấn chuyên nghiệp, tận tâm, góp phần kiến tạo nên những không gian sống đẳng cấp và bền vững cùng thời gian.
          </motion.p>
        </section>
      </div>
    </DefaultLayout>
  );
}
