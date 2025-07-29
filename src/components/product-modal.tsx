import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem,
    addToast
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import ReactQuill from "react-quill";

import { productServices } from "@/services/product";
import { Category, categoryServices, subCategory } from "@/services/category";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";

// const categories = [
//     { key: "clothes", label: "Quần áo" },
//     { key: "accessories", label: "Phụ kiện" },
// ];

// Interface cho dữ liệu bảng
export interface VariantData {
    id?: string; // Optional ID for each variant
    parentName: string;
    parentImage: string | null;
    childName: string;
    price: string;
    stock: string;
    sku: string;
}

export interface ProductModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface AttributeOption {
    id: string;
    value: string;
}

export interface ProductAttribute {
    id: string;
    name: string;
    options: AttributeOption[];
}

export interface ProductInput {
    name: string;
    description: string;
    categoryId: string;
    attributes: ProductAttribute[];
    variants: VariantData[];
}

export interface GeneralData {
    price: string;
    stock: string;
    sku: string;
}

export const ProductModal = ({ isOpen, onOpenChange }: ProductModalProps) => {
    const [selectedCategory, setSelectedCategory] = useState < Set < string >> (new Set([]));
    const [productImage, setProductImage] = useState < File[] > ([]);
    const [previewIndex, setPreviewIndex] = useState < number | null > (null);
    const [category, setCategory] = useState < Category[] > ([]);
    const [subCategory, setSubCategory] = useState < subCategory[] > ([]);
    const [selectedFinalCategory, setSelectedFinalCategory] = useState < Set < string >> (new Set([]));
    const [errors, setErrors] = useState < Record < string, string>> ({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function removeVietnameseTones(str: string): string {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/\s+/g, "")
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
            images: [],
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
            productImage.forEach((file) => {
                data.append("images", file);
            });

            try {
                const response = await productServices.createProduct(data);
                console.log("Product created successfully:", response);
            } catch (error) {
                console.error("Error creating product:", error);
            }
        },
    });

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

    function closeModal() {
        onOpenChange(false);
        setSelectedCategory(new Set([]));
        formik.resetForm();
        setProductImage([]);
        setPreviewIndex(null);
        setSelectedFinalCategory(new Set([])); // Reset selected final category
        setSelectedCategory(new Set([])); // Reset selected category
        setErrors({});
    }

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
        if (isOpen) {
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

            fetchCategories();
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            scrollBehavior={"inside"}
            size="5xl"
            onOpenChange={closeModal}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Tạo sản phẩm</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-700"
                                    htmlFor="product-image-upload"
                                >
                                    <span className="text-red-500">*</span> Ảnh sản phẩm{" "}
                                    <span className="font-normal">
                                        ({productImage?.length}/5)
                                    </span>
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
                                                        src={URL.createObjectURL(file)}
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
                                        src={URL.createObjectURL(productImage[previewIndex])}
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
                            <Select
                                className="w-full mb-4"
                                label="Đơn vị kích thước"
                                placeholder="Chọn đơn vị kích thước"
                                selectedKeys={new Set([formik.values.sizeUnit])} // ✅ luôn có 1 giá trị mặc định
                                onSelectionChange={(keys) => {
                                    const stringKeys = Array.from(keys as Set<unknown>).map(String);
                                    formik.setFieldValue("sizeUnit", stringKeys[0]);
                                }}
                            >
                                <SelectItem key="cm">cm</SelectItem>
                                <SelectItem key="m">m</SelectItem>
                                <SelectItem key="mm">mm</SelectItem>
                            </Select>
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
                                onChange={formik.handleChange("description")}
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
                                    const stringKeys = Array.from(keys as Set<unknown>).map(
                                        String,
                                    );

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
                                        selectedCat.child &&
                                        selectedCat.child.length > 0
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
                                            .flatMap((cat) => cat.child)
                                            .map((sub) => (
                                                <SelectItem key={sub.id}>{sub.name}</SelectItem>
                                            ))}
                                    </Select>
                                )}
                        </ModalBody>
                        <ModalFooter className="flex flex-row items-center">
                            <Button
                                variant="bordered"
                                onPress={() => {
                                    closeModal();
                                    onClose();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button color="primary" variant="solid" onPress={
                                formik.handleSubmit}>
                                Tạo sản phẩm
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
