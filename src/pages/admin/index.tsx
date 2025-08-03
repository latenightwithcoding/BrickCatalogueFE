import { Button } from "@heroui/button";
import {
  addToast,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";

import { productServices, RequestProduct } from "@/services/product";
import { Category, categoryServices, subCategory } from "@/services/category";
import { authService } from "@/services/auth";
import AdminLayout from "@/layouts/admin";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  GeneralData,
  ProductAttribute,
  ProductInput,
  ProductModal,
  VariantData,
} from "@/components/product-modal";
import { ProductDetailModel } from "@/services/product";
import { ProductsDetailModel } from "@/services/product";
import { useSearchParams } from "react-router-dom";
import CustomSelect from "@/components/custom-select";
import ConfirmModal from "@/components/confirm-modal";

export default function AdminIndexPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onOpenChange: onOpenChangeConfirm } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState < ResponseProduct | null > (null);
  const [request, setRequest] = useState < RequestProduct > ({
    page: page,
    pageSize: 10,
    keyword: searchParams.get("keyword") || null,
  });
  const inputRef = useRef < HTMLInputElement > (null);
  const [showHint, setShowHint] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState < string | null > (null);

  const fetchShopData = async () => {
    setIsLoading(true);
    try {
      const response = await productServices.getProductsForAdmin({
        ...request,
        page: page,
      });

      const newParams: Record<string, string> = { page: String(page) };
      if (request.keyword) {
        newParams.keyword = request.keyword;
      }
      setSearchParams(newParams);

      if (response) {
        setProducts(response);
      } else {
        addToast({
          title: "Không tìm thấy sản phẩm",
          description: "Cửa hàng này chưa có sản phẩm nào.",
          color: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    fetchShopData();
  }, [page, request.keyword, isOpen]);

  const deleteProduct = async (productId: string) => {
    try {
      const response = await productServices.deleteProduct(productId);
      if (response) {
        addToast({
          title: "Thành công",
          description: "Sản phẩm đã được xóa thành công",
          color: "success",
        });
        fetchShopData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <AdminLayout>
      <section className="flex flex-col max-w-full gap-4 py-8 md:py-10">
        <div className="flex items-center justify-between mt-4">
          <h1 className={"text-2xl font-semibold"}>Quản lý sản phẩm</h1>
          <ProductModal isOpen={isOpen} onOpenChange={onOpenChange} />
          <ConfirmModal
            isOpen={isOpenConfirm}
            title="Xác nhận xóa sản phẩm"
            message="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onClose={() => {
              setSelectedProductId(null);
              onOpenChangeConfirm();
            }}
            onConfirm={() => {
              if (selectedProductId) {
                deleteProduct(selectedProductId);
              }
              onOpenChangeConfirm();
            }}
          />
          <div className="flex flex-row items-center gap-4">
            <Input
              className="w-96 "
              placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
              endContent={
                showHint && (
                  <div className="flex items-center text-gray-500 text-[12px] w-52">
                    <p>Nhấn Enter để tìm kiếm</p>
                  </div>
                )
              }
              defaultValue={searchParams.get("keyword") || ""}
              ref={inputRef}
              onChange={() => {
                setShowHint(!!inputRef.current?.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  setRequest((prev) => ({
                    ...prev,
                    keyword: inputRef.current?.value || "",
                  }));
                }
              }}
            />
            <Button
              color="primary"
              variant="solid"
              onPress={() => {
                onOpenChange();
              }}
            >
              Thêm sản phẩm
            </Button>
          </div>
        </div>
        <div>
          <Table
            aria-label="Product Table"
            bottomContent={
              products && products.totalPages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={products.totalPages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
            className={"w-full"}
          >
            <TableHeader>
              <TableColumn className="text-left">Thumbnail</TableColumn>
              <TableColumn className="text-left">Tên sản phẩm</TableColumn>
              <TableColumn className="text-left">SKU</TableColumn>
              <TableColumn className="text-left">Loại sản phẩm</TableColumn>
              <TableColumn className="text-left">Kích thước</TableColumn>
              <TableColumn className="text-left">Hành động</TableColumn>
            </TableHeader>
            <TableBody
              // items={products.data ?? []}
              loadingContent={<Spinner />}
              loadingState={isLoading ? "loading" : "idle"}
            >
              {/* Example data, replace with actual product data */}
              {products && products.items.length > 0 ? (
                products.items.map((product: ProductsDetailModel) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-left">
                      <img
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        src={product.images[0]}
                      />
                    </TableCell>
                    <TableCell className="text-left">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-left">{product.sku}</TableCell>
                    <TableCell className="text-left">
                      {product.category.name}
                    </TableCell>
                    <TableCell className="text-left">
                      {product.size} {product.sizeUnit}
                    </TableCell>
                    <TableCell className="flex justify-start text-left gap-4">
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => {
                          // Handle edit product logic here
                          window.location.href = `/admin/product/${product.id}/edit`;
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={() => {
                          setSelectedProductId(product.id);
                          onOpenChangeConfirm();
                        }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center" colSpan={6}>
                    Không có sản phẩm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </AdminLayout>
  );
}

export function AdminEditProductPage() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState < Set < string >> (
    new Set([]),
  );
  const [productImage, setProductImage] = useState < File[] > ([]);
  const [previewIndex, setPreviewIndex] = useState < number | null > (null);
  const [category, setCategory] = useState < Category[] > ([]);
  const [subCategory, setSubCategory] = useState < subCategory[] > ([]);
  const [selectedFinalCategory, setSelectedFinalCategory] = useState <
    Set < string >
  > (new Set([]));
  const [errors, setErrors] = useState < Record < string, string>> ({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên sản phẩm là bắt buộc"),
    sku: Yup.string().required("Mã sản phẩm là bắt buộc"),
    description: Yup.string().required("Mô tả sản phẩm là bắt buộc"),
    size: Yup.string().required("Kích thước sản phẩm là bắt buộc"),
    sizeUnit: Yup.string().required("Đơn vị kích thước là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      sku: "",
      description: "",
      size: "",
      sizeUnit: "cm", // ✅ đặt mặc định là "cm"
    },
    validationSchema,
    onSubmit: async (values) => {
      if (productImage.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: "Ít nhất một ảnh sản phẩm là bắt buộc",
        }));
        addToast({
          title: "Lỗi",
          description: "Ít nhất một ảnh sản phẩm là bắt buộc",
          color: "danger",
        });
        return;
      }
      const data = new FormData();
      data.append("name", values.name);
      data.append("sku", values.sku);
      data.append("description", values.description);
      data.append("size", values.size);
      data.append("sizeUnit", values.sizeUnit);
      data.append("categoryId", Array.from(selectedFinalCategory)[0] || Array.from(selectedCategory)[0] || "");
      // productImage.forEach((file) => {
      //   data.append("images", file);
      // });
      for (const item of productImage) {
        if (typeof item === "string") {
          const fileName = item.split("/").pop() ?? "image.jpg";
          const file = await urlToFile(item, fileName, "image/jpeg"); // hoặc đoán type từ đuôi file
          data.append("images", file);
        } else {
          data.append("images", item); // File object
        }
      }

      try {
        const response = await productServices.updateProduct(id, data);
        if (response) {
          addToast({
            title: "Thành công",
            description: "Sản phẩm đã được cập nhật thành công",
            color: "success",
          });
        }
      } catch (error) {
        console.error("Error creating product:", error);
      }
    },
  });

  function removeVietnameseTones(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "") // bỏ khoảng trắng nếu cần
      .toLowerCase();
  }

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
    if (previewIndex !== null && previewIndex < productImage.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  // Update variant data

  async function urlToFile(
    url: string,
    fileName: string,
    mimeType: string,
  ): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();

    return new File([blob], fileName, { type: mimeType });
  }

  // xử lý upload ảnh sản phẩm tối đa là 5 tấm
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(
        0,
        5 - (productImage?.length || 0),
      );

      setProductImage((prev) => (prev ? [...prev, ...newFiles] : newFiles));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryServices.getAll(); // Thay đổi URL theo API của bạn

        if (response) {
          setCategory(response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchData = async () => {
      if (id) {
        try {
          const response = await productServices.getProductForAdmin(id);
          if (response) {

            formik.setValues({
              name: response.name,
              sku: response.sku,
              description: response.description,
              size: response.size,
              sizeUnit: response.sizeUnit
            });

            setProductImage(
              response.images
                ? response.images.map((img: any) =>
                  typeof img === "string" ? img : img.url,
                )
                : [],
            );
            if (response.category.parent) {
              setSelectedCategory(new Set([response.category.parent.id]));
              setSelectedFinalCategory(new Set([response.category.id]));
            } else {
              setSelectedCategory(new Set([response.category.id]));
            }
          }

        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      }
    };

    fetchCategories();
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      // Revoke all object URLs on cleanup
      productImage.forEach((img) => {
        if (typeof img !== "string") {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [productImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const withPreview = files.map((file) => {
      const preview = URL.createObjectURL(file);

      return Object.assign(file, { preview });
    });

    setProductImage((prev) => [...(prev || []), ...withPreview]);
  };

  return (
    <AdminLayout>
      <section className="flex gap-4 py-8 md:py-10">
        <div className="flex flex-col gap-2 w-full">
          <Button
            className="mb-4 w-fit"
            color="primary"
            variant="flat"
            onPress={() => (window.location.href = "/admin")}
          >
            Quay lại
          </Button>
          <h1 className={"text-2xl font-semibold"}>Chỉnh sửa sản phẩm</h1>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="product-image-upload"
            >
              <span className="text-red-500">*</span> Ảnh sản phẩm{" "}
              <span className="font-normal">({productImage?.length}/5)</span>
            </label>
            <div className="flex items-center gap-4">
              {productImage &&
                productImage.map((file, index) => (
                  <div key={index} className="relative">
                    <button
                      aria-label={`Xem trước ảnh sản phẩm ${index + 1}`}
                      className="p-0 border-none bg-transparent"
                      style={{ display: "block" }}
                      tabIndex={0}
                      type="button"
                      onClick={() => handleImageClick(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleImageClick(index);
                        }
                      }}
                    >
                      <img
                        alt={`Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                        src={typeof file === "string" ? file : URL.createObjectURL(file)}
                      />
                    </button>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      type="button"
                      onClick={() =>
                        setProductImage(
                          (prev) =>
                            prev?.filter((_, i) => i !== index) || null,
                        )
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              {productImage && productImage.length < 5 && (
                <div className="w-24 h-24 relative border border-dashed border-gray-300 rounded flex items-center justify-center hover:border-primary">
                  <Upload
                    className="text-gray-400 pointer-events-none"
                    size={24}
                  />
                  <input
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    onChange={handleProductImageUpload}
                  />
                </div>
              )}
              {!productImage && (
                <div className="w-24 h-24 relative border border-dashed border-gray-300 rounded flex items-center justify-center hover:border-primary">
                  <Upload
                    className="text-gray-400 pointer-events-none"
                    size={24}
                  />
                  <input
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    onChange={handleProductImageUpload}
                  />
                </div>
              )}
            </div>
          </div>
          {previewIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              {/* Đóng */}
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                title="Đóng"
                onClick={handleClosePreview}
              >
                &times;
              </button>

              {/* Trái */}
              <button
                className="absolute left-4 text-white text-3xl px-3 py-1 hover:bg-white/10 disabled:opacity-50"
                disabled={previewIndex === 0}
                onClick={handlePrev}
              >
                &#10094;
              </button>

              {/* Ảnh lớn */}
              <img
                src={typeof productImage[previewIndex] === "string" ? productImage[previewIndex] : URL.createObjectURL(file)}
                alt={`Preview ${previewIndex + 1}`}
                className="max-w-4xl max-h-[90vh] object-contain rounded shadow-lg"
              />

              {/* Phải */}
              <button
                className="absolute right-4 text-white text-3xl px-3 py-1 hover:bg-white/10 disabled:opacity-50"
                disabled={previewIndex === productImage.length - 1}
                onClick={handleNext}
              >
                &#10095;
              </button>
            </div>
          )}
          <Input
            required
            className="mb-4"
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange("name")}
          />
          {formik.touched.name &&
            typeof formik.errors.name === "string" ? (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          ) : null}
          <Input
            required
            className="mb-4"
            label="Mã sản phẩm"
            placeholder="Nhập mã sản phẩm"
            type="text"
            value={formik.values.sku}
            onChange={formik.handleChange("sku")}
          />
          {formik.touched.sku &&
            typeof formik.errors.sku === "string" ? (
            <p className="text-red-500 text-sm">{formik.errors.sku}</p>
          ) : null}
          <Input
            required
            className="mb-4"
            label="Kích thước sản phẩm"
            placeholder="Nhập kích thước sản phẩm"
            type="text"
            value={formik.values.size}
            onChange={formik.handleChange("size")}
          />
          {formik.touched.size &&
            typeof formik.errors.size === "string" ? (
            <p className="text-red-500 text-sm">
              {formik.errors.size}
            </p>
          ) : null}
          <CustomSelect
            label="Đơn vị kích thước"
            options={[
              { id: "cm", name: "cm" },
              { id: "m", name: "m" },
              { id: "mm", name: "mm" },
            ]}
            placeholder="Chọn đơn vị kích thước"
            selectedKeys={new Set([formik.values.sizeUnit])}
            onSelectionChange={(keys) => {
              const stringKeys = Array.from(keys as Set<unknown>).map(String);
              formik.setFieldValue("sizeUnit", stringKeys[0]);
            }}
          />
          {formik.touched.sizeUnit &&
            typeof formik.errors.sizeUnit === "string" ? (
            <p className="text-red-500 text-sm">
              {formik.errors.sizeUnit}
            </p>
          ) : null}
          {/* <Textarea
                                label="Mô tả sản phẩm"
                                placeholder="Nhập mô tả sản phẩm"
                                className="mb-4"
                                rows={4}
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                required
                            /> */}
          <p className="text-sm">Mô tả sản phẩm</p>
          {/* <div
                                className={`border rounded-xl min-h-52 bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                style={{ overflow: 'hidden' }}
                            > */}
          <ReactQuill
            className="min-h-36 h-36 mb-12"
            readOnly={isSubmitting}
            theme="snow"
            value={formik.values.description}
            defaultValue={formik.values.description}
            onChange={(value) => formik.setFieldValue("description", value)}
          />
          {/* </div> */}
          {errors.description && (
            <span className="text-red-400">{errors.description}</span>
          )}
          {/* <Select
                                className="w-full mb-4 min-h-12 [&_[data-slot='trigger']]:py-2 [&_[data-slot='label']]:truncate"
                                label="Danh mục sản phẩm"
                                selectedKeys={selectedCategory}
                                onSelectionChange={(keys) => {
                                    const stringKeys = Array.from(keys as Set<unknown>).map(String);
                                    setSelectedCategory(new Set(stringKeys));
                                }}
                            >
                                {category.map((category) => (
                                    <SelectItem key={category.id}>{category.name}</SelectItem>
                                ))}
                            </Select> */}

          <CustomSelect
            label="Danh mục sản phẩm"
            placeholder="Chọn danh mục sản phẩm"
            options={category}
            selectedKeys={selectedCategory}
            onSelectionChange={(keys) => {
              const stringKeys = Array.from(keys).map(String);
              setSelectedCategory(new Set(stringKeys));
            }}
          />
          {selectedCategory.size > 0 &&
            (() => {
              const selectedCat = category.find(
                (c) => c.id === Array.from(selectedCategory)[0],
              );

              return (
                selectedCat &&
                selectedCat.child &&
                selectedCat.child.length > 0
              );
            })() && (
              <CustomSelect
                label="Danh mục con"
                placeholder="Chọn danh mục con của sản phẩm"
                options={category
                  .filter((cat) => selectedCategory.has(cat.id))
                  .flatMap((cat) => cat.child)}
                selectedKeys={selectedFinalCategory}
                onSelectionChange={(keys) => {
                  const stringKeys = Array.from(keys as Set<unknown>).map(String);
                  setSelectedFinalCategory(new Set(stringKeys));
                }}
              />
            )}
          <Button
            className="mt-4"
            color="primary"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onPress={formik.handleSubmit}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </section>
    </AdminLayout>
  );
}
