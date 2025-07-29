import { Button } from "@heroui/button";
import {
  addToast,
  Input,
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
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";

import { productServices, RequestProduct } from "@/services/product";
import { Category, categoryServices, subCategory } from "@/services/category";
import { authService } from "@/services/auth";
import AdminLayout from "@/layouts/admin";
import {
  GeneralData,
  ProductAttribute,
  ProductInput,
  ProductModal,
  VariantData,
} from "@/components/product-modal";
import { ProductDetailModel } from "@/services/product";
import { ProductsDetailModel } from "@/services/product";

export default function AdminIndexPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState < ResponseProduct | null > (null);
  const [request, setRequest] = useState < RequestProduct > ({
    page: 1,
    pageSize: 10,
    keywords: null,
  });

  useEffect(() => {
    const slug = localStorage.getItem("userPath");

    if (!slug) {
      const logout = async () => {
        await authService.logout();
      };
    }
    setIsLoading(true);
    const fetchShopData = async () => {
      try {
        const response = await productServices.getProductsForAdmin({
          ...request,
          page: page,
        });

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

      // Fetch shop data logic here
      // This is where you would call your API to get the shop's products
    };

    fetchShopData();
  }, [page]);

  return (
    <AdminLayout>
      <section className="flex flex-col max-w-full gap-4 py-8 md:py-10">
        <div className="flex items-center justify-between">
          <h1 className={"text-2xl font-semibold"}>Thiết lập cửa hàng</h1>
          <ProductModal isOpen={isOpen} onOpenChange={onOpenChange} />
          <Button
            className="mt-4"
            color="primary"
            variant="solid"
            onPress={() => {
              onOpenChange();
            }}
          >
            Thêm sản phẩm
          </Button>
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
                    <TableCell className="text-left">
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => {
                          // Handle edit product logic here
                          window.location.href = `/admin/shop/products/${product.id}/edit`;
                        }}
                      >
                        Sửa
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
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [toggleAttributeForm, setToggleAttributeForm] = useState(false);
  const [productImage, setProductImage] = useState < File[] > ([]);
  const [previewIndex, setPreviewIndex] = useState < number | null > (null);
  const [category, setCategory] = useState < Category[] > ([]);
  const [subCategory, setSubCategory] = useState < subCategory[] > ([]);
  const [selectedFinalCategory, setSelectedFinalCategory] = useState <
    Set < string >
  > (new Set([]));
  const [errors, setErrors] = useState < Record < string, string>> ({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalData, setGeneralData] = useState < GeneralData > ({
    price: "",
    stock: "",
    sku: "",
  });
  const [enableClassification, setEnableClassification] = useState(false);

  const [attributes, setAttributes] = useState < ProductAttribute[] > ([
    // {
    //     id: '1',
    //     name: 'Màu',
    //     options: [{ id: '1-1', value: 'Đỏ' }, { id: '1-2', value: 'Xanh' }, { id: '1-3', value: 'Xanh lá' }]
    // },
    // {
    //     id: '2',
    //     name: 'Size',
    //     options: [{ id: '1-1', value: 'M', }, { id: '1-2', value: 'L' }, { id: '1-3', value: 'XL' }]
    // }
  ]);

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

  // Dữ liệu bảng phân loại
  const [variantData, setVariantData] = useState < VariantData[] > ([
    // SE group
    // { parentName: "Đỏ", parentImage: null, childName: "M", price: "", stock: "", sku: "" },
    // { parentName: "Đỏ", parentImage: null, childName: "L", price: "", stock: "", sku: "" },
    // { parentName: "Đỏ", parentImage: null, childName: "XL", price: "", stock: "", sku: "" },
    // // SE plus group
    // { parentName: "Xanh", parentImage: null, childName: "M", price: "", stock: "", sku: "" },
    // { parentName: "Xanh", parentImage: null, childName: "L", price: "", stock: "", sku: "" },
    // { parentName: "Xanh", parentImage: null, childName: "XL", price: "", stock: "", sku: "" },
    // // Pro group
    // { parentName: "Xanh lá", parentImage: null, childName: "M", price: "", stock: "", sku: "" },
    // { parentName: "Xanh lá", parentImage: null, childName: "L", price: "", stock: "", sku: "" },
    // { parentName: "Xanh lá", parentImage: null, childName: "XL", price: "", stock: "", sku: "" },
  ]);

  // Group data theo parent
  const getGroupedData = (): { [key: string]: VariantData[] } => {
    const groups: { [key: string]: VariantData[] } = {};

    variantData.forEach((item) => {
      if (!groups[item.parentName]) {
        groups[item.parentName] = [];
      }
      groups[item.parentName].push(item);
    });

    // console.log(groups);
    return groups;
  };

  // Update variant data
  const updateVariantData = (
    parentName: string,
    childName: string,
    field: keyof VariantData,
    value: string,
  ) => {
    setVariantData((prev) =>
      prev.map((item) =>
        item.parentName === parentName && item.childName === childName
          ? { ...item, [field]: value }
          : item,
      ),
    );
  };

  // Handle image upload
  const handleImageUpload = (parentName: string, file: File) => {
    const imageUrl = URL.createObjectURL(file);

    setVariantData((prev) =>
      prev.map((item) =>
        item.parentName === parentName
          ? { ...item, parentImage: imageUrl }
          : item,
      ),
    );
  };

  // Remove image
  const removeImage = (parentName: string) => {
    setVariantData((prev) =>
      prev.map((item) =>
        item.parentName === parentName ? { ...item, parentImage: null } : item,
      ),
    );
  };

  async function urlToFile(
    url: string,
    fileName: string,
    mimeType: string,
  ): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();

    return new File([blob], fileName, { type: mimeType });
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    const finalData = handleSubmitData({
      name: productName,
      description: productDescription,
      categoryId:
        Array.from(selectedFinalCategory)[0] || Array.from(selectedCategory)[0],
      attributes: attributes,
      variants: variantData,
    });

    formData.append("Product", JSON.stringify(finalData));

    // Chuẩn hóa productImage: nếu là URL thì convert về File
    for (const item of productImage) {
      if (typeof item === "string") {
        const fileName = item.split("/").pop() ?? "image.jpg";
        const file = await urlToFile(item, fileName, "image/jpeg"); // hoặc đoán type từ đuôi file

        formData.append("ProductImage", file);
      } else {
        formData.append("ProductImage", item); // File object
      }
    }

    // Attribute Images
    for (let i = 0; i < variantData.length; i++) {
      const image = variantData[i].parentImage;

      if (image) {
        if (typeof image === "string") {
          const fileName = image.split("/").pop() ?? "attr.jpg";
          const file = await urlToFile(image, fileName, "image/jpeg");

          formData.append("AttributeImage", file);
        } else {
          formData.append("AttributeImage", image);
        }
      }
    }

    try {
      const response = await productServices.updateProduct(formData, id);

      if (response && response.statusCodes === 200) {
        addToast({
          title: "Thông báo",
          description: "Cập nhật sản phẩm thành công!",
          color: "success",
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      addToast({
        title: "Thông báo",
        description: "Cập nhật sản phẩm thất bại, vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // xử lý upload ảnh sản phẩm tối đa là 9 tấm
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(
        0,
        9 - (productImage?.length || 0),
      );

      setProductImage((prev) => (prev ? [...prev, ...newFiles] : newFiles));
    }
  };

  const handleEditorChange = (value: string) => {
    setProductDescription(value);

    // Clear error if there's content
    if (errors.description && value && value.trim() !== "<p><br></p>") {
      const { description, ...rest } = errors;

      setErrors(rest);
    }

    if (value.trim() === "" || value.trim() === "<p><br></p>") {
      setErrors({
        ...errors,
        description: "Mô tả là bắt buộc",
      });
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
      const slug = localStorage.getItem("userPath");

      if (!slug) {
        const logout = async () => {
          await authService.logout();
        };

        logout();

        return;
      }
      if (id) {
        try {
          const response = await productServices.getProduct(id, slug);

          if (response) {
            const product = response;

            // Tên, mô tả, ảnh
            setProductName(product.name);
            setProductDescription(product.description);
            setProductImage(product.productImages || []);

            // Danh mục
            setSelectedCategory(new Set([product.category?.id]));
            setSelectedFinalCategory(
              new Set([
                product.category?.subCategories?.[0]?.id ||
                product.category?.id,
              ]),
            );

            // Thuộc tính
            if (product.attribute && product.attribute.length > 0) {
              setEnableClassification(true);

              setAttributes(
                product.attribute.map((attr, index) => ({
                  id: `attr-${index}`, // gán id giả nếu không có id
                  name: attr.name,
                  options: attr.options.map((opt, idx) => ({
                    id: opt.id,
                    value: opt.value,
                    image: opt.image || null,
                  })),
                })),
              );

              // Biến thể
              const parentAttr = product.attribute.find(
                (attr) => attr.isParent,
              );
              const childAttr = product.attribute.find(
                (attr) => !attr.isParent,
              );

              const parentOptionOrder =
                parentAttr?.options.map((opt) => opt.id) || [];

              const sortedVariantData = product.variant
                .map((variant) => {
                  const [parentId, childId] = variant.attributeIndex;

                  const parentOpt = parentAttr?.options.find(
                    (opt) => opt.id === parentId,
                  );
                  const childOpt = childAttr?.options.find(
                    (opt) => opt.id === childId,
                  );

                  return {
                    parentId,
                    parentName: parentOpt?.value || "",
                    parentImage: parentOpt?.image || "",
                    childName: childOpt?.value || "",
                    price: variant.price.toString(),
                    stock: variant.stock.toString(),
                    sku: variant.sku,
                  };
                })
                .sort((a, b) => {
                  const indexA = parentOptionOrder.indexOf(a.parentId);
                  const indexB = parentOptionOrder.indexOf(b.parentId);

                  return indexA - indexB;
                });

              setVariantData(sortedVariantData);
            } else if (product.variant && product.variant.length > 0) {
              setGeneralData({
                price: product.variant[0].price.toString(),
                stock: product.variant[0].stock.toString(),
                sku: product.variant[0].sku,
              });
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
            onPress={() => (window.location.href = "/admin/shop/")}
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
              <span className="font-normal">({productImage?.length}/9)</span>
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
                        src={
                          typeof file === "string"
                            ? file
                            : URL.createObjectURL(file)
                        }
                      />
                    </button>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      type="button"
                      onClick={() =>
                        setProductImage(
                          (prev) => prev?.filter((_, i) => i !== index) || null,
                        )
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              {productImage && productImage.length < 9 && (
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
                alt={`Preview ${previewIndex + 1}`}
                className="max-w-4xl max-h-[90vh] object-contain rounded shadow-lg"
                src={
                  typeof productImage[previewIndex] === "string"
                    ? productImage[previewIndex]
                    : URL.createObjectURL(file)
                }
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
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
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
            className="min-h-36 h-36 mb-14"
            readOnly={isSubmitting}
            theme="snow"
            value={productDescription}
            onChange={handleEditorChange}
          />
          {/* </div> */}
          {errors.description && (
            <span className="text-red-400">{errors.description}</span>
          )}
          <Select
            className="w-full mb-4"
            label="Danh mục sản phẩm"
            placeholder="Chọn danh mục"
            selectedKeys={selectedCategory}
            onSelectionChange={(keys) => {
              const stringKeys = Array.from(keys as Set<unknown>).map(String);

              setSelectedCategory(new Set(stringKeys));
            }}
          >
            {category.map((category) => (
              <SelectItem key={category.id}>{category.name}</SelectItem>
            ))}
          </Select>
          {selectedCategory.size > 0 &&
            (() => {
              const selectedCat = category.find(
                (c) => c.id === Array.from(selectedCategory)[0],
              );

              return (
                selectedCat &&
                selectedCat.subCategories &&
                selectedCat.subCategories.length > 0
              );
            })() && (
              <Select
                className="w-full mb-4"
                label="Danh mục con"
                placeholder="Chọn danh mục con"
                selectedKeys={selectedFinalCategory}
                onSelectionChange={(keys) => {
                  const stringKeys = Array.from(keys as Set<unknown>).map(
                    String,
                  );

                  setSelectedFinalCategory(new Set(stringKeys)); // Cập nhật subCategory theo keys
                }}
              >
                {category
                  .filter((cat) => selectedCategory.has(cat.id))
                  .flatMap((cat) => cat.subCategories)
                  .map((sub) => (
                    <SelectItem key={sub.id}>{sub.name}</SelectItem>
                  ))}
              </Select>
            )}
          <DynamicCategoryForm
            attributes={attributes}
            enableClassification={enableClassification}
            generalData={generalData}
            setAttributes={setAttributes}
            setEnableClassification={setEnableClassification}
            setGeneralData={setGeneralData}
            setVariantData={setVariantData}
            variantData={variantData}
          />
          <Button
            className="mt-4"
            color="primary"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </section>
    </AdminLayout>
  );
}
