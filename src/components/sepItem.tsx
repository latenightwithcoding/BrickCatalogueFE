import { Link } from "@heroui/link";

const SepNavbarItem = ({
    children,
    className = '',
    isLast = false,
    onMouseEnter,
    onMouseLeave,
    innerRef,
    href = '#',
}) => {
    return (
        <div
            ref={innerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex items-center"
        >
            <Link href={href} className={`cursor-pointer ${className}`}>
                {children}
            </Link>
            {!isLast && (
                <div className="ml-2 text-gray-400 text-lg select-none">•</div>
            )}
        </div>
    );
};

export default SepNavbarItem;
