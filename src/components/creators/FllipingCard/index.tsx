import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";

interface FlippingCardProps {
    images: string[];
}

const FlippingCard: React.FC<FlippingCardProps> = ({ images }) => {
    const [flipped, setFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isVisible) {
            intervalId = setInterval(() => {
                setFlipped((prev) => !prev);
            }, 4000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isVisible]);

    useEffect(() => {
        if (flipped) {
            setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    }, [flipped, images.length]);

    return (
        <div className={styles.container}>
            <div
                ref={cardRef}
                className={`${styles.card} ${flipped ? styles.flipped : ""}`}
            >
                <div className={styles.front}>
                    <img src={images[imageIndex]} alt='front' />
                </div>
                <div className={styles.back}>
                    <img
                        src={images[(imageIndex + 1) % images.length]}
                        alt='Back'
                    />
                </div>
            </div>
        </div>
    );
};

export default FlippingCard;
