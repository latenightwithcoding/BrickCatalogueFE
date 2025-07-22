import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const ProductCard = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative flex w-full max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl aspect-[4/3] items-center justify-center overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
            style={{
                backgroundImage: "url('/images/1.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Gradient nền mờ LUÔN hiển thị */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(15,91,150,0.5) 100%)",
                }}
            />

            {/* Overlay phủ toàn bộ khi hover */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-20 bg-[#0f5b96]/40 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Border box khi hover */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-4 z-30 rounded-xl border-4 border-white"
                    />
                )}
            </AnimatePresence>

            {/* Text di chuyển lên khi hover */}
            <motion.div
                animate={{ y: hovered ? -70 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full z-30 flex items-end justify-center font-gilroy font-semibold text-lg sm:text-xl md:text-2xl text-white"
            >
                <p className="pb-4">CL12-GP8801</p>
            </motion.div>
        </div>
    );
};
