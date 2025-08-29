import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoPause,
    IoPlay,
} from 'react-icons/io5';

interface Slide {
    id: number;
    title: string;
    src: string;
}

interface SlideshowProps {
    slides: Slide[];
    autoPlay?: boolean;
    interval?: number;
    showControls?: boolean;
    showIndicators?: boolean;
}

const Slideshow: React.FC<SlideshowProps> = ({
    slides,
    autoPlay = true,
    interval = 5000,
    showControls = true,
    showIndicators = true,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            nextSlide();
        }, interval);

        return () => clearInterval(timer);
    }, [isPlaying, interval, nextSlide]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === ' ') {
                setIsPlaying((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    return (
        <div className="relative h-[300px] w-[50%] min-w-[400px]">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 to-purple-800">
                {/* Slides container */}
                <div className="relative h-full w-full">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="flex h-full w-full flex-col items-center justify-center text-white">
                                <img
                                    src={slides[currentIndex].src}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation controls */}
                {showControls && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all duration-300 hover:bg-black/50"
                            aria-label="Previous slide"
                        >
                            <IoChevronBackOutline className="text-2xl" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all duration-300 hover:bg-black/50"
                            aria-label="Next slide"
                        >
                            <IoChevronForwardOutline className="text-2xl" />
                        </button>
                    </>
                )}

                {/* Play/Pause button */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute top-4 right-4 z-10 rounded-full bg-black/30 p-2 text-white transition-all duration-300 hover:bg-black/50"
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                    {isPlaying ? (
                        <IoPause className="text-xl" />
                    ) : (
                        <IoPlay className="text-xl" />
                    )}
                </button>

                {/* Indicators */}
                {showIndicators && (
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white'
                                    : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Progress bar */}
                <div className="absolute top-0 right-0 left-0 z-10 h-1">
                    <motion.div
                        className="h-full bg-indigo-300"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: interval / 1000, ease: 'linear' }}
                        key={currentIndex}
                    />
                </div>
            </div>

            <p className="absolute top-[100%] left-[50%] translate-x-[-50%] transform text-center">
                {slides[currentIndex].title}
            </p>
        </div>
    );
};

export default Slideshow;
