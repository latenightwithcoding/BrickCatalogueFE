import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface SliderProps {
  images: string[];
  onSlideChange?: (index: number) => void;
}

export const Slider = ({ images, onSlideChange }: SliderProps) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % images.length;

        onSlideChange?.(next); // 🔁 Gọi callback mỗi lần auto slide

        return next;
      });
    }, 7000);
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  const goPrev = () => {
    setCurrent((prev) => {
      const next = (prev - 1 + images.length) % images.length;

      onSlideChange?.(next); // 🔁 Gọi callback khi click nút

      return next;
    });
    startAutoSlide();
  };

  const goNext = () => {
    setCurrent((prev) => {
      const next = (prev + 1) % images.length;

      onSlideChange?.(next); // 🔁 Gọi callback khi click nút

      return next;
    });
    startAutoSlide();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          alt={`Slide ${i + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          src={img}
        />
      ))}

      {/* Navigation buttons */}
      <button
        className="!w-16 !h-16 flex items-center justify-center text-3xl absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-2 rounded-full hover:bg-opacity-70 transition z-20"
        onClick={goPrev}
      >
        {/* &#8592; */}
        <FaArrowLeft />
      </button>
      <button
        className="!w-16 !h-16 flex items-center justify-center text-3xl absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-20 text-white px-3 py-2 rounded-full hover:bg-opacity-70 transition z-20"
        onClick={goNext}
      >
        {/* &#8594; */}
        <FaArrowRight />
      </button>
    </div>
  );
};
