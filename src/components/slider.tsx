import { useState, useEffect, useRef } from "react";

interface SliderProps {
    images: string[];
}

export const Slider = ({ images }: SliderProps) => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef < NodeJS.Timeout | null > (null);

    const startAutoSlide = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 7000);
    };

    useEffect(() => {
        startAutoSlide();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [images.length]);

    const goPrev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
        startAutoSlide(); // reset thời gian
    };

    const goNext = () => {
        setCurrent((prev) => (prev + 1) % images.length);
        startAutoSlide(); // reset thời gian
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={`Slide ${i + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                />
            ))}

            {/* Navigation buttons */}
            <button
                onClick={goPrev}
                className="flex items-center text-3xl absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-80 transition z-20"
            >
                &#8592;
            </button>
            <button
                onClick={goNext}
                className="flex items-center text-3xl absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-80 transition z-20"
            >
                &#8594;
            </button>
        </div>
    );
};
