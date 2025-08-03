import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Input } from "@heroui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";
import { Button } from "@heroui/button";

import { authService } from "@/services/auth";

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
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/admin";
    }
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

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Tên không được để trống")
        .min(3, "Tên phải có ít nhất 3 ký tự")
        .max(50, "Tên không được vượt quá 50 ký tự"),
      password: Yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Tên phải có ít nhất 6 ký tự")
        .max(50, "Tên không được vượt quá 50 ký tự"),
    }),
    onSubmit: async (values: { username: string; password: string }) => {
      setLoginLoading(true);
      try {
        // Giả lập quá trình đăng nhập
        const response = await authService.login(
          values.username,
          values.password,
        );

        if (response) {
          addToast({
            title: "Thông báo",
            description: "Đăng nhập thành công!",
            color: "success",
          });
        }
        setTimeout(() => {
          // Chuyển hướng đến trang chính sau khi đăng nhập thành công
          window.location.href = "/admin";
        }, 2500);
      } catch (error) {
        if (error instanceof AxiosError) {
          var message = error.response?.data?.message?.toString() ?? "";

          addToast({
            title: "Thông báo",
            description: message.includes("Password is incorrect")
              ? "Sai mật khẩu"
              : message.includes("User not found")
                ? "Tài khoản không tồn tại"
                : String(error),
            color: "danger",
          });
        } else {
          addToast({
            title: "Thông báo",
            description: "Đăng nhập thất bại, vui lòng thử lại sau.",
            color: "danger",
          });
        }
      } finally {
        setLoginLoading(false);
      }
    },
  });

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      style={{
        backgroundImage: "url('/images/1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000000",
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, y: 50 }}
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
          pointerEvents: "none",
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {/* Chữ XUÂN HƯƠNG */}
        <motion.div
          animate={groupControls}
          className="flex gap-2 justify-center text-[150px] font-gilroy font-extrabold stroke-text text-transparent pointer-events-none"
          initial={{ y: 0 }}
        >
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              animate="visible"
              className="inline-block"
              custom={index}
              initial="hidden"
              variants={letterVariants}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Card login */}
        {showCard && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 -translate-x-1/2 translate-y-[80px] w-[600px] backdrop-blur-md rounded-2xl shadow-xl p-6 z-10"
            initial={{ opacity: 0, y: 50 }}
            style={{
              background: "#ffffff88",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.199)",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-xl font-gilroy font-semibold text-black mb-4">
              Đăng nhập
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={formik.handleSubmit}
            >
              <Input
                className="font-gilroy shadow-sm"
                placeholder="Tên đăng nhập"
                type="text"
                value={formik.values.username}
                onChange={(event) =>
                  formik.setFieldValue("username", event.target.value)
                }
              />
              {formik.touched.username &&
                typeof formik.errors.username === "string" ? (
                <p className="text-red-500">{formik.errors.username}</p>
              ) : null}
              <Input
                className="font-gilroy shadow-sm"
                endContent={
                  <button
                    className="text-gray-500 hover:text-gray-700 transition"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaRegEye className="w-5 h-5" />
                    )}
                  </button>
                }
                placeholder="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
              />
              {formik.touched.password &&
                typeof formik.errors.password === "string" ? (
                <p className="text-red-500">{formik.errors.password}</p>
              ) : null}
              <Button
                className="mt-2 bg-blue-500 hover:bg-blue-600 font-gilroy text-white py-2 rounded-lg transition"
                isLoading={loginLoading}
                type="submit"
              >
                Đăng nhập
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
