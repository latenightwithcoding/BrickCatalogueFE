import { Link } from "@heroui/link";

const SepNavbarItem = ({
  children,
  className = "",
  isLast = false,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  href = "#",
}) => {
  return (
    <div
      ref={innerRef}
      className="flex items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link className={`cursor-pointer ${className}`} href={href}>
        {children}
      </Link>
      {!isLast && (
        <div className="ml-2 text-gray-400 text-lg select-none">•</div>
      )}
    </div>
  );
};

export default SepNavbarItem;
