import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { addToast } from "@heroui/react";
import ReactQuill from "react-quill";

import { productServices } from "@/services/product";
import { Category, categoryServices, subCategory } from "@/services/category";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";

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

    // Handle image upload
    const handleImageUpload = (parentName: string, file: File) => {
        const imageUrl = URL.createObjectURL(file);
    };

    // Remove image
    const removeImage = (parentName: string) => { };

    // const formik = useFormik({
    //     initialValues: {
    //         name: "",
    //         description: "",
    //         categoryId: "",
    //         attributes: [],
    //         variants: [],
    //     },
    //     onSubmit: async (values) => {
    //         setIsSubmitting(true);
    //         try {
    //             const productData: ProductInput = {
    //                 name: values.name,
    //                 description: values.description,
    //                 categoryId: Array.from(selectedCategory)[0] || "",
    //                 attributes: values.attributes,
    //                 variants: values.variants,
    //             }
    //         }}
    // });

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
        setProductName("");
        setProductDescription("");
        setToggleAttributeForm(false);
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
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <Input
                                required
                                className="mb-4"
                                label="Mã sản phẩm"
                                placeholder="Nhập mã sản phẩm"
                                type="text"
                                value={productSKU}
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
                                className="min-h-36 h-36 mb-12"
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
                        <ModalFooter className="flex flex-row items-center justify-between">
                            <Button
                                variant="light"
                                onPress={() => {
                                    closeModal();
                                    onClose();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button color="primary" variant="solid" onPress={handleSubmit}>
                                Tạo sản phẩm
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
