export const Footer = () => {
    return (
        <footer className="bg-[#f8f9fa] text-gray-700 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} Xuân Hương. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/privacy" className="text-sm hover:text-blue-500">Privacy Policy</a>
                        <a href="/terms" className="text-sm hover:text-blue-500">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}