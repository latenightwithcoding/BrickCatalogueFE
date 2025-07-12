import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  Input,
} from "@heroui/input"

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8 + i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export default function LoginPage() {
  const title = "XUÂN HƯƠNG";
  const [showCard, setShowCard] = useState(false);
  const groupControls = useAnimation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const letterDuration = title.length * 100 + 1400;

    // Chữ nhích lên
    const moveUpTimeout = setTimeout(() => {
      groupControls.start({
        y: -120,
        transition: { duration: 0.6, ease: "easeOut" },
      });
    }, letterDuration);

    // Card xuất hiện sau
    const cardTimeout = setTimeout(() => {
      setShowCard(true);
    }, letterDuration + 500);

    return () => {
      clearTimeout(moveUpTimeout);
      clearTimeout(cardTimeout);
    };
  }, [groupControls]);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000000"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {/* Chữ XUÂN HƯƠNG */}
        <motion.div
          animate={groupControls}
          initial={{ y: 0 }}
          className="flex gap-2 justify-center text-[150px] font-gilroy font-extrabold stroke-text text-transparent pointer-events-none"
        >
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Card login */}
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-1/2 -translate-x-1/2 translate-y-[80px] w-[600px] backdrop-blur-md rounded-2xl shadow-xl p-6 z-10"
            style={{
              background: "#ffffff88",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.199)",
            }}
          >
            <h2 className="text-xl font-gilroy font-semibold text-black mb-4">Đăng nhập</h2>
            <form className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Tên đăng nhập"
                className="font-gilroy shadow-sm"
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="font-gilroy shadow-sm"
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FaRegEyeSlash className="w-5 h-5" /> : <FaRegEye className="w-5 h-5" />}
                  </button>
                }
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 font-gilroy text-white py-2 rounded-lg transition"
              >
                Đăng nhập
              </button>
            </form>
          </motion.div>
        )}


      </div>
    </section>
  );
}
