import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export function useScrollTrigger(threshold = 0.2, once = false) {
    const ref = useRef(null);
    const [show, setShow] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > threshold) {
            setShow(true);
        } else if (!once) {
            setShow(false);
        }
    });

    return { ref, show };
}