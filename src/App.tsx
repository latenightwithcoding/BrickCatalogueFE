import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/admin/login";
import ProductDetail from "./pages/productDetail";
import AdminIndexPage from "./pages/admin/index";

import IndexPage from "@/pages/index";
import CategoryProduct from "@/pages/categoryProduct";
import BlogPage from "@/pages/blog";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CategoryProduct />} path="/category/:id" />
      <Route element={<ProductDetail />} path="/product/:id" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AdminIndexPage />} path="/admin" />
      <Route path="/admin">
        <Route element={<LoginPage />} path="login" />
      </Route>
    </Routes>
  );
}

export default App;
