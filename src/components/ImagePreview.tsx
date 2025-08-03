import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImagePreview({ thumbnails }: { thumbnails: string[] }) {
  const [selected, setSelected] = useState(thumbnails[0]);
  const [previewIndex, setPreviewIndex] = useState < number | null > (null);

  const handleImageClick = (index: number) => {
    setPreviewIndex(index);
  };

  const handleClosePreview = () => {
    setPreviewIndex(null);
  };

  const handlePrev = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handleNext = () => {
    if (previewIndex !== null && previewIndex < thumbnails.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

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
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
                src={img}
              />
            </motion.button>

            <AnimatePresence>
              {selected === img && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-lg border-4 border-blue-600 pointer-events-none"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="border"
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 flex justify-center items-center bg-white rounded-lg p-6 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.button
            key={selected}
            className="p-0 border-none bg-transparent"
            type="button"
            onClick={() => handleImageClick(thumbnails.indexOf(selected))}
            style={{ display: "block" }}
          >
            <motion.img
              alt="Ảnh chính"
              className="w-full max-w-[500px] aspect-square object-cover rounded-md"
              src={selected}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </AnimatePresence>

        {/* Fullscreen Preview Modal */}
        {previewIndex !== null && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center">
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={handleClosePreview}
              title="Đóng"
            >
              &times;
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 text-white text-3xl px-3 py-1 hover:bg-white/10 disabled:opacity-50"
              disabled={previewIndex === 0}
              onClick={handlePrev}
            >
              &#10094;
            </button>

            {/* Image */}
            <img
              alt={`Preview ${previewIndex + 1}`}
              className="max-w-4xl max-h-[90vh] object-contain rounded shadow-lg"
              src={thumbnails[previewIndex]}
            />

            {/* Next */}
            <button
              className="absolute right-4 text-white text-3xl px-3 py-1 hover:bg-white/10 disabled:opacity-50"
              disabled={previewIndex === thumbnails.length - 1}
              onClick={handleNext}
            >
              &#10095;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
