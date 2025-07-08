import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { Slider } from "@/components/slider";

export default function IndexPage() {
  const scrollRef = useRef(null);
  const image = ["https://media.discordapp.net/attachments/1305489841928142889/1392069335484203049/b3ede70738648e3ad775.jpg?ex=686e3118&is=686cdf98&hm=72a76d2889052e88281cd6873a118f134e4fffad57faddfa3f09a1fc0b7db8e9&=&format=webp", "https://media.discordapp.net/attachments/1305489841928142889/1392069335803105350/cf3b9cd143b2f5ecaca3.jpg?ex=686e3119&is=686cdf99&hm=cc215c2d07f49b16e8e99ff4f04ee70dfa769bf2d91bc6486c6a667e921e340a&=&format=webp", "https://media.discordapp.net/attachments/1305489841928142889/1392069336117674044/4f4a39a1e6c2509c09d3.jpg?ex=686e3119&is=686cdf99&hm=9ac33fb8af5d91d3a8b6cad7fbfb5fe9c5a65f3fccb36ac61561a8ff928eb7e9&=&format=webp"]

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
        <section className="relative min-h-screen flex items-center justify-center">
          {/* <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${image[0]})`,
            }}
          /> */}
          <Slider images={image} />
          <div className="relative z-10">
            {/* Content chính */}
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
