import SepNavbarItem from "./sepItem";

export const SubNavbar = ({ category }) => {
    const itemClass =
        "text-base font-medium px-2 py-1 hover:text-blue-500 text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition";

    return (
        <div className="shadow-lg bg-[#ffffff88] backdrop-blur-[8px] border-t py-4 px-6 rounded-b-2xl">
            <div className="flex flex-wrap gap-x-4 gap-y-3">
                {category.map((cat, index) => (
                    <SepNavbarItem
                        key={cat?.id || index}
                        className={itemClass}
                        isLast={index === category.length - 1}
                        href={`/category/${cat.id}`}
                    >
                        {cat.name}
                    </SepNavbarItem>
                ))}
            </div>
        </div>
    );
};
