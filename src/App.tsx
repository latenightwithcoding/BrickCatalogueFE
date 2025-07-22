import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CategoryProduct from "@/pages/categoryProduct";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import LoginPage from "./pages/admin/login";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CategoryProduct />} path="/category/:id" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route path="/admin">
        <Route element={<LoginPage />} path="login" />
      </Route>
    </Routes>
  );
}

export default App;
