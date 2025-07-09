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
  motion
} from "framer-motion";

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
  const words = titleText.split(" ");
  const image = ["https://media.discordapp.net/attachments/1305489841928142889/1392069335484203049/b3ede70738648e3ad775.jpg?ex=686e3118&is=686cdf98&hm=72a76d2889052e88281cd6873a118f134e4fffad57faddfa3f09a1fc0b7db8e9&=&format=webp", "https://media.discordapp.net/attachments/1305489841928142889/1392069335803105350/cf3b9cd143b2f5ecaca3.jpg?ex=686e3119&is=686cdf99&hm=cc215c2d07f49b16e8e99ff4f04ee70dfa769bf2d91bc6486c6a667e921e340a&=&format=webp", "https://media.discordapp.net/attachments/1305489841928142889/1392069336117674044/4f4a39a1e6c2509c09d3.jpg?ex=686e3119&is=686cdf99&hm=9ac33fb8af5d91d3a8b6cad7fbfb5fe9c5a65f3fccb36ac61561a8ff928eb7e9&=&format=webp", "https://media.discordapp.net/attachments/1305489841928142889/1392409999048704020/858bb9c294615c07c379587bb8a8fdb53a51e678-1440x810.png?ex=686f6e5d&is=686e1cdd&hm=5bb014d99f8ce739924d334d88804c877fa8d130cf906ee93777d800c8efbb5e&=&format=webp&quality=lossless"]

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


        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
            <br />
            <span className={title()}>
              websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Beautiful, fast and modern React UI library.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
              </span>
            </Snippet>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
            <br />
            <span className={title()}>
              websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Beautiful, fast and modern React UI library.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
              </span>
            </Snippet>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
            <br />
            <span className={title()}>
              websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Beautiful, fast and modern React UI library.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
              </span>
            </Snippet>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
            <br />
            <span className={title()}>
              websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Beautiful, fast and modern React UI library.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
              </span>
            </Snippet>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
