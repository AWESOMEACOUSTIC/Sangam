import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardStackable from './CardStackable';
import BTS_DATA from '../../../data/behindthescene';
import TrailerModal from '../../../common/components/TrailerModal';


const BehindTheScene = () => {
    const [cards, setCards] = useState(BTS_DATA);
    const [activeMovie, setActiveMovie] = useState(null);

    const handleDragEnd = (event, info) => {
        const threshold = 100;
        const { offset } = info;
        if (Math.abs(offset.x) > threshold || Math.abs(offset.y) > threshold) {
            // Move top card to the back of the stack
            setCards((prev) => [...prev.slice(1), prev[0]]);
        }

    };
    const handleWatchTrailer = useCallback((movie) => {
        setActiveMovie(movie);
    }, []);
    const handleCloseModal = useCallback(() => {
        setActiveMovie(null);
    }, []);

    return (
        <>
            <section
                className="w-full min-h-screen px-4 sm:px-8
                                     md:px-12 lg:px-16 py-10 font-sans"
            >
                {/* Header */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <div className="px-4 py-2 inline-block">
                            <h1
                                className="text-3xl sm:text-4xl font-extrabold
                                                     text-yellow-400 leading-tight"
                            >
                                Behind the Scenes
                            </h1>
                            <div className="mt-6 mb-8 flex items-center gap-2">
                                <div className="w-1 h-6 bg-yellow-400"></div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Exclusive making footage
                                </h2>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="w-full flex items-center justify-center p-4 py-16 sm:p-8">
                    <div className="w-full max-w-4xl">
                        <div className="w-full aspect-video relative flex items-center justify-center mb-6">
                            <ul className="relative w-full h-full m-0 p-0">
                                <AnimatePresence>
                                    {cards.slice(0, 5).map((card, index) => {
                                        const isTopCard = index === 0;
                                        const scale = 1 - index * 0.06;
                                        const top = `-${index * 8}%`;
                                        const brightness = 1 - index * 0.15;
                                        const zIndex = 5 - index;

                                        return (
                                            <CardStackable
                                                key={card.id || card.youtubeId}
                                                card={card}
                                                zIndex={zIndex}
                                                scale={scale}
                                                top={top}
                                                brightness={brightness}
                                                isTopCard={isTopCard}
                                                onDragEnd={isTopCard ? handleDragEnd : undefined}
                                                onPlay={() => handleWatchTrailer(card)}
                                            />
                                        );
                                    })}
                                </AnimatePresence>
                            </ul>
                        </div>
                        <div className="flex justify-center mt-5 sm:mt-12">
                            <p className="text-zinc-400 font-medium text-sm text-center bg-zinc-900/50 px-4 py-2 rounded-full">
                                Drag the top card to shuffle the deck
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Trailer Modal */}
            <TrailerModal movie={activeMovie} onClose={handleCloseModal} />
        </>
    );
};
export default BehindTheScene;