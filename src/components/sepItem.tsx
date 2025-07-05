const SepNavbarItem = ({
    children,
    className = '',
    isLast = false,
    onMouseEnter,
    onMouseLeave,
    innerRef, // <- thêm dòng này
}) => {
    return (
        <div
            className="flex items-center gap-4"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={innerRef} // <- gắn ref vào div này
        >
            <div className={`cursor-pointer ${className}`}>
                {children}
            </div>
            {!isLast && <div className="mx-2 text-gray-400">•</div>}
        </div>
    );
};

export default SepNavbarItem;
