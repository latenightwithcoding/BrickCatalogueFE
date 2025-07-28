import SepNavbarItem from "./sepItem";

export const SubNavbar = ({ category }) => {
  const itemClass =
    "text-base font-medium px-2 py-1 hover:text-[#527aaf] text-black rounded-full hover:border-white hover:bg-white hover:shadow-lg transition";

  return (
    <div className="shadow-lg bg-[#ffffff88] backdrop-blur-[8px] border-t py-4 px-6 rounded-b-2xl">
      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {category.map((cat, index) => (
          <SepNavbarItem
            key={cat?.id || index}
            className={itemClass}
            href={`/category/${cat.id}`}
            isLast={index === category.length - 1}
          >
            {cat.name}
          </SepNavbarItem>
        ))}
      </div>
    </div>
  );
};
