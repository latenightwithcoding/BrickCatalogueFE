import { useEffect, useState, useRef } from "react";

interface Option {
    id: string;
    name: string;
}

interface CustomSelectProps {
    label: string;
    placeholder?: string;
    options: Option[];
    selectedKeys: Set<string>;
    onSelectionChange: (keys: Set<string>) => void;
}

export default function CustomSelect({
    label,
    placeholder,
    options,
    selectedKeys,
    onSelectionChange
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const idRef = useRef < string > (crypto.randomUUID()); // Unique ID cho mỗi select
    const selectedId = Array.from(selectedKeys)[0];
    const selectedOption = options.find((o) => o.id === selectedId);

    // Khi mở select, gửi sự kiện để các select khác đóng lại
    const handleToggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState) {
            window.dispatchEvent(new CustomEvent("custom-select-open", { detail: idRef.current }));
        }
    };

    // Đóng nếu sự kiện phát ra từ select khác
    useEffect(() => {
        const handleOtherSelectOpen = (e: Event) => {
            const event = e as CustomEvent;
            if (event.detail !== idRef.current) {
                setIsOpen(false);
            }
        };
        window.addEventListener("custom-select-open", handleOtherSelectOpen);
        return () => {
            window.removeEventListener("custom-select-open", handleOtherSelectOpen);
        };
    }, []);

    return (
        <div className="relative w-full mb-4">
            <label className="block text-sm text-gray-500 mb-1">{label}</label>
            <div
                className="border px-4 py-2 rounded-md cursor-pointer bg-white shadow-sm min-h-12 flex items-center justify-between"
                onClick={handleToggleOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleToggleOpen();
                    }
                }}
            >
                <span className={`truncate ${selectedOption ? "" : "text-gray-500"}`}>{selectedOption?.name || placeholder || "Tùy chọn..."}</span>
                <span className="ml-2">▾</span>
            </div>

            {isOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedId === opt.id ? "bg-gray-200 font-semibold" : ""
                                }`}
                            role="option"
                            tabIndex={0}
                            aria-selected={selectedId === opt.id}
                            onClick={() => {
                                onSelectionChange(new Set([opt.id]));
                                setIsOpen(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    onSelectionChange(new Set([opt.id]));
                                    setIsOpen(false);
                                }
                            }}
                        >
                            {opt.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
