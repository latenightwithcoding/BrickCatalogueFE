const SepNavbarItem = ({
    children,
    className = '',
    isLast = false,
    onMouseEnter,
    onMouseLeave,
    innerRef,
}) => {
    return (
        <div
            ref={innerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex items-center"
        >
            <div className={`cursor-pointer ${className}`}>
                {children}
            </div>
            {!isLast && (
                <div className="ml-2 text-gray-400 text-lg select-none">•</div>
            )}
        </div>
    );
};

export default SepNavbarItem;
