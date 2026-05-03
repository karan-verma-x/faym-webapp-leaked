import React, { useState } from "react";
import styles from "./index.module.css";
import { Creator } from "../../../DataModels/creators";

type CarouselProps = {
    creators: Creator[];
};

const Carousel: React.FC<CarouselProps> = ({ creators }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const images = creators.map((e) => e.profilePicture);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const nextTwoImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
    };

    const prevTwoImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 2 + images.length) % images.length
        );
    };

    const getOnClick = (position: number) => {
        switch (position) {
            case -2:
                return prevTwoImage;
            case -1:
                return prevImage;
            case 2:
                return nextTwoImage;
            case 1:
                return nextImage;
            default:
                return () => {};
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        const direction = currentX - startX > 0 ? "right" : "left";
        console.log(`Swiped ${direction}`);
        if (direction === "left") {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        } else {
            setCurrentIndex(
                (prevIndex) => (prevIndex - 1 + images.length) % images.length
            );
        }
    };

    const getImageContainerClassName = (position: number) => {
        switch (position) {
            case -2:
            case 2:
                return styles.carouselImageContainerExtreme;
            case -1:
            case 1:
                return styles.carouselImageContainerSecondExtreme;
            case 0:
                return styles.carouselImageContainerCenter;
            default:
                return "";
        }
    };

    const getImageClassName = (position: number) => {
        switch (position) {
            case -2:
            case 2:
                return styles.carouselImageExtreme;
            case -1:
            case 1:
                return styles.carouselImageSecondExtreme;
            case 0:
                return styles.carouselImageCenter;
            default:
                return "";
        }
    };

    const getZIndex = (position: number) => {
        switch (position) {
            case -2:
                return "0";
            case -1:
                return "1";
            case 0:
                return "2";
            case 1:
                return "1";
            case 2:
                return "0";
            default:
                return "0";
        }
    };

    const getTransform = (position: number) => {
        switch (position) {
            case -2:
                return "translateX(-128%) rotateY(45deg) rotateX(0deg)";
            case -1:
                return "translateX(-70%) rotateY(45deg) rotateX(0deg)";
            case 0:
                return "translateX(0%) rotateY(0deg) rotateX(0deg)";
            case 1:
                return "translateX(70%) rotateY(-45deg) rotateX(0deg)";
            case 2:
                return "translateX(128%) rotateY(-45deg) rotateX(0deg)";
            default:
                return "none";
        }
    };

    const getVisibility = (position: number) => {
        return position >= -2 && position <= 2 ? "visible" : "hidden";
    };

    return (
        <div className={styles.carouselContainer}>
            <div
                className={styles.carousel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, index) => {
                    const position =
                        (index - currentIndex + images.length) % images.length;
                    return (
                        <div
                            onClick={getOnClick(position - 2)}
                            key={index}
                            className={`${
                                styles.carouselImage
                            } ${getImageContainerClassName(position - 2)}`}
                            style={{
                                transform: getTransform(position - 2),
                                visibility: getVisibility(position - 2),
                                zIndex: getZIndex(position - 2),
                                transformOrigin: getTransform(position - 2),
                            }}
                        >
                            <img
                                src={image}
                                alt={`carousel ${index}`}
                                className={getImageClassName(position - 2)}
                            />
                            <div className={styles.overlay}></div>
                            {position - 2 === 0 && (
                                <div
                                    className={styles.instagramInfoContainer}
                                    onClick={() =>
                                        window.open(
                                            `https://www.instagram.com/${creators[index].userName}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    <img
                                        src='/assets/instagram-colored.png'
                                        className={
                                            styles.instagramImageContainer
                                        }
                                    />
                                    <div className={styles.instagramInfo}>
                                        <div className={styles.username}>
                                            @{creators[index].userName}
                                        </div>
                                        <div className={styles.followers}>
                                            {creators[index].followers}{" "}
                                            Followers
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className={styles.nav}>
                <img
                    src='/assets/arrow-prev.svg'
                    className={styles.navButton}
                    onClick={prevImage}
                />
                <div className={styles.carouselIndicatorsContainer}>
                    {images.map((e, index) => {
                        const position =
                            (index - currentIndex + images.length) %
                            images.length;
                        return (
                            <div
                                key={index}
                                className={
                                    position === 0
                                        ? styles.carouselIndicatorSelected
                                        : styles.carouselIndicator
                                }
                            ></div>
                        );
                    })}
                </div>
                <img
                    src='/assets/arrow-next.svg'
                    className={styles.navButton}
                    onClick={nextImage}
                />
            </div>
        </div>
    );
};

export default Carousel;
