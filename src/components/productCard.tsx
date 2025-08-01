import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Products } from "@/services/product";

export const ProductCard = (data: Products) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      aria-label={`View product ${data.sku}`}
      className="relative flex w-full max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl aspect-[4/3] items-center justify-center overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
      role="button"
      style={{
        backgroundImage: `url(${data.images[0]}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      tabIndex={0}
      onClick={() => {
        window.location.href = `/product/${data.id}`;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          window.location.href = `/product/${data.id}`;
        }
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
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-[#0f5b96]/40 pointer-events-none"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Border box khi hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-4 z-30 rounded-xl border-4 border-white"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Text di chuyển lên khi hover */}
      <motion.div
        animate={{ y: hovered ? -70 : 0 }}
        className="absolute inset-0 h-full w-full z-30 flex items-end justify-center font-gilroy font-bold text-lg sm:text-xl md:text-2xl text-white"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <p className="pb-4">{data.sku.toUpperCase()}</p>
      </motion.div>
    </div>
  );
};
