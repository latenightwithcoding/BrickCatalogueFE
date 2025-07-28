import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImagePreview({ thumbnails }) {
  const [selected, setSelected] = useState(thumbnails[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-6 p-4 w-full max-w-4xl mx-auto">
      {/* Thumbnails */}
      <div className="flex md:flex-col flex-row items-center justify-center gap-3">
        {thumbnails.map((img, i) => (
          <div key={i} className="relative w-20 h-12">
            <motion.button
              className="w-full h-full rounded overflow-hidden"
              whileHover={{ scale: selected === img ? 1 : 1.05 }}
              onClick={() => setSelected(img)}
            >
              <img
                alt={`Gach ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
                src={img}
              />
            </motion.button>

            {/* Border animation using framer-motion */}
            <AnimatePresence>
              {selected === img && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-lg border-4 border-blue-600 pointer-events-none"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="border"
                  transition={{ duration: 0.3 }}
                  whileHover={{ opacity: 1 }} // làm sao để hover ảnh thì xuất hiện viền
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 flex justify-center items-center bg-white rounded-lg p-6 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected} // đảm bảo motion hoạt động khi src thay đổi
            alt="Gach lớn"
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[500px] aspect-square object-cover rounded-md"
            exit={{ opacity: 0, x: -10 }}
            initial={{ opacity: 0, x: 10 }}
            src={selected}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
