export const SubNavbar = ({ category }) => {
    return (
        <div className="shadow-lg bg-[#ffffff88] backdrop-blur-[8px] border-t py-4 px-6 rounded-b-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {category.map((cat) => (
                    <div
                        key={cat.id}
                        className="cursor-pointer text-gray-700 hover:text-blue-500 whitespace-nowrap items-center"
                    >
                        • {cat.name}
                    </div>
                ))}
            </div>
        </div>
    );
};
