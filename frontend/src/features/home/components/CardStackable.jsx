import { motion } from 'framer-motion';

const CardStackable = ({
  src,
  alt,
  zIndex,
  scale,
  top,
  brightness,
  isTopCard,
  onDragEnd,
}) => {
  return (
    <motion.li
      className={`absolute w-full h-full rounded-2xl overflow-hidden list-none ${
        isTopCard ? 'cursor-grab active:cursor-grabbing' : 'cursor-auto'
      }`}
      style={{
        zIndex,
        top,
        filter: `brightness(${brightness})`,
      }}
      initial={false}
      animate={{ scale, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      drag={isTopCard}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      onDragEnd={onDragEnd}
      layout
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover pointer-events-none block"
        draggable={false}
      />
    </motion.li>
  );
};

export default CardStackable;