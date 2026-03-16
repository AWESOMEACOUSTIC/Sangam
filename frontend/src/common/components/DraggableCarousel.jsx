import { useRef, useState, useEffect, Children, cloneElement, isValidElement } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";

export default function DraggableCarousel({ children, gap = "gap-4" }) {
  const carouselRef = useRef(null);
  const innerRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);

  // Recalculate constraints on resize / children change
  useEffect(() => {
    const calc = () => {
      if (!carouselRef.current || !innerRef.current) return;
      const outer = carouselRef.current.offsetWidth;
      const inner = innerRef.current.scrollWidth;
      const maxDrag = Math.max(0, inner - outer);
      setConstraints({ left: -maxDrag, right: 0 });
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (carouselRef.current) ro.observe(carouselRef.current);
    return () => ro.disconnect();
  }, [children]);

  // Clamp helper
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const handleDragStart = (_, info) => {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragStartTime.current = Date.now();
    controls.stop();
  };

  const handleDragEnd = (_, info) => {
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = info.velocity.x;

    // Momentum scroll
    const momentum = velocity * 0.3;
    const projected = clamp(
      x.get() + momentum,
      constraints.left,
      constraints.right
    );

    controls.start({
      x: projected,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 0.8,
        restDelta: 0.5,
      },
    });

    // Short timeout so click events can check isDragging
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing
                 -mx-1 px-1"
    >
      <motion.div
        ref={innerRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.08}
        dragMomentum={false}
        style={{ x }}
        animate={controls}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`flex ${gap} w-max py-4`}
        whileTap={{ cursor: "grabbing" }}
      >
        {/* Inject isDragging into each child safely */}
        {Children.map(children, (child, i) => {
          if (!isValidElement(child)) return null;
          return (
            <div key={child.key ?? i} className="flex-shrink-0">
              {cloneElement(child, { isDragging })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}