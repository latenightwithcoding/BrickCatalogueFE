import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/react";

export function NotFoundPage() {
    return (
        <DefaultLayout>
            <div className="flex items-center flex-col justify-center h-screen gap-4">
                <h1 className="text-4xl font-gilroy font-bold text-gray-800">Không tìm thấy trang</h1>
                <Button
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-gilroy font-bold py-2 px-4 rounded"
                    onClick={() => window.location.href = "/"}
                >
                    Quay về Trang Chủ
                </Button>
            </div>
        </DefaultLayout>
    );
}