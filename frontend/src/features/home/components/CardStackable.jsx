import { motion } from 'framer-motion';

const CardStackable = ({
  card,
  zIndex,
  scale,
  top,
  brightness,
  isTopCard,
  onDragEnd,
  onPlay,
}) => {
  return (
    <motion.li
      className={`absolute w-full h-full rounded-2xl overflow-hidden list-none shadow-2xl group ${
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
        src={card.thumbnail}
        alt={card.title}
        className="w-full h-full object-cover pointer-events-none block"
        draggable={false}
      />
      
      {/* Title overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black/90 to-transparent pointer-events-none transition-opacity duration-300">
          <h3 className="text-white text-2xl font-bold sm:text-3xl lg:text-4xl">{card.title}</h3>
      </div>

      {/* Play button overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 pointer-events-none ${
          isTopCard ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={(e) => {
            if (isTopCard) {
              e.stopPropagation();
              onPlay();
            }
          }}
          onPointerDown={(e) => {
            // Stop drag if clicking play button
            e.stopPropagation();
          }}
          className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400/90 hover:bg-yellow-400 hover:scale-110 shadow-lg transition-transform ${
            isTopCard ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          aria-label={`Play ${card.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10 text-black ml-1"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </motion.li>
  );
};

export default CardStackable;