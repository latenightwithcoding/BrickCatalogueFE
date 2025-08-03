import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/admin/login";
import ProductDetail from "./pages/productDetail";
import AdminIndexPage, { AdminEditProductPage } from "./pages/admin/index";

import IndexPage from "@/pages/index";
import CategoryProduct from "@/pages/categoryProduct";
import BlogPage from "@/pages/blog";
import { NotFoundPage } from "./pages/not-found";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CategoryProduct />} path="/category/:id" />
      <Route element={<ProductDetail />} path="/product/:id" />
      <Route element={<BlogPage />} path="/blog" />
      <Route path="/admin">
        <Route element={<AdminIndexPage />} path="/admin" />
        <Route element={<LoginPage />} path="login" />
        <Route element={<AdminEditProductPage />} path="product/:id/edit" />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
