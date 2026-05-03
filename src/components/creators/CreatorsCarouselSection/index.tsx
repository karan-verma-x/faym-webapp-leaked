import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import { Creator } from "../../../DataModels/creators";
import { signToken } from "../../../service/cypher";


const CreatorsCarouselSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
    const images = creators.map((e) => e.profilePicture);

    const getCreators = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({url: "api/website/creators/info", token: token});
            if (response) {
                setCreators(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCreators();
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setHiddenIndices([currentIndex]);
        setTimeout(() => {
            setHiddenIndices([]);
        }, 500);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
        setHiddenIndices([(currentIndex - 1 + images.length) % images.length]);
        setTimeout(() => {
            setHiddenIndices([]);
        }, 500);
    };

    const getOnClick = (position: number) => {
        switch (position) {
            case -1:
                return prevImage;
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
            nextImage();
        } else {
            prevImage();
        }
    };

    const getImageContainerClassName = (index: number, position: number) => {
        if (
            hiddenIndices.includes(index) &&
            (position === -2 || position === 2)
        ) {
            return styles.carouselImageContainerHidden;
        }
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
                return "translateX(-220%) translateY(-10%)  ";
            case -1:
                return "translateX(-110%)  translateY(-5%)";
            case 0:
                return "translateX(0%) translateY(0%)";
            case 1:
                return "translateX(110%) translateY(-5%)";
            case 2:
                return "translateX(220%) translateY(-10%)";
            default:
                return "none";
        }
    };

    const getVisibility = (position: number) => {
        return position >= -2 && position <= 2 ? "visible" : "hidden";
    };

    return (
        <div className={styles.container} data-theme='light'>
            <h2 className={styles.heading}>Meet the Faym Stars</h2>
            {window.innerWidth <= 500 ? (
                <p className={styles.subheading}>
                Tap into the Community of<br/>Top Creators Across Every Niche.
                </p>
            ) : (
                <p className={styles.subheading}>
                Tap into the Community of Top Creators Across Every Niche.
                </p>
            )}
            
            <div className={styles.carouselContainer}>
                <div
                    className={styles.carousel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {images.map((image, index) => {
                        const position =
                            (index - currentIndex + images.length) %
                            images.length;
                        return (
                            <div
                                onClick={getOnClick(position - 2)}
                                key={index}
                                className={`${
                                    styles.carouselImage
                                }  ${getImageContainerClassName(
                                    index,
                                    position - 2
                                )}`}
                                style={{
                                    transform: getTransform(position - 2),
                                    visibility: getVisibility(position - 2),
                                    zIndex: getZIndex(position - 2),
                                    transformOrigin: getTransform(position - 2),
                                    transition:
                                        "transform 0.5s ease-in-out, visibility 0.5s ease-in-out",
                                }}
                            >
                                <img
                                    src={image}
                                    alt={`carousel ${index}`}
                                    className={getImageClassName(position - 2)}
                                />
                                <div
                                    className={`${
                                        position - 2 !== 0
                                            ? styles.overlay
                                            : styles.overlay2
                                    }`}
                                ></div>
                                {position - 2 === 0 && (
                                    <div
                                        className={
                                            styles.instagramInfoContainer
                                        }
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
                        src='/assets/next_arrow.svg'
                        className={styles.navButton}
                        onClick={prevImage}
                        style={{ transform: "rotateY(180deg)" }}
                    />
                    <img
                        src='/assets/next_arrow.svg'
                        className={styles.navButton}
                        onClick={nextImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreatorsCarouselSection;
