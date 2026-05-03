import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import { StoreData } from "../../../DataModels/storeData";
import { signToken } from "../../../service/cypher";

interface FlippingCardProps {
    images: string[];
    isVisible: boolean;
}

export const FlipCard: React.FC<FlippingCardProps> = ({
    images,
    isVisible,
}) => {
    const [flipped, setFlipped] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isVisible) {
            intervalId = setInterval(() => {
                setFlipped((prev) => !prev);
            }, 2000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isVisible]);

    return (
        <div className={styles.cardContainer}>
            <div
                ref={cardRef}
                className={`${styles.card} ${flipped ? styles.flipped : ""}`}
            >
                <div className={styles.front}>
                    <img src={images[0]} alt='front' />
                </div>
                <div className={styles.back}>
                    <img src={images[1]} alt='Back' />
                </div>
            </div>
        </div>
    );
};

const MobileFaymstoreCreatorsCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
    const [storeData, setStoreData] = useState<StoreData[]>([]);

    const getStoreInfo = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/store/info",
                token: token,
            });
            if (response) {
                setStoreData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStoreInfo();
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % storeData.length);
        setHiddenIndices([currentIndex]);
        setTimeout(() => {
            setHiddenIndices([]);
        }, 500);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + storeData.length) % storeData.length
        );
        setHiddenIndices([
            (currentIndex - 1 + storeData.length) % storeData.length,
        ]);
        setTimeout(() => {
            setHiddenIndices([]);
        }, 500);
    };

    const nextTwoImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 2) % storeData.length);
    };

    const prevTwoImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 2 + storeData.length) % storeData.length
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
                return "translateX(-220%)";
            case -1:
                return "translateX(-110%)";
            case 0:
                return "translateX(0%)";
            case 1:
                return "translateX(110%)";
            case 2:
                return "translateX(220%)";
            default:
                return "none";
        }
    };

    const getVisibility = (position: number) => {
        return position >= -2 && position <= 2 ? "visible" : "hidden";
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, storeData.length]);

    return (
        <div className={styles.container}>
            <div className={styles.carouselContainer}>
                <div
                    className={styles.carousel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {storeData.map((data, index) => {
                        const position =
                            (index - currentIndex + storeData.length) %
                            storeData.length;
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
                                }}
                            >
                                <div
                                    className={getImageClassName(position - 2)}
                                >
                                    {" "}
                                    <FlipCard
                                        images={[
                                            data.storeFrontImg,
                                            data.storeBackImg,
                                        ]}
                                        isVisible={position - 2 === 0}
                                    />
                                    <div
                                        className={styles.instagramDetails}
                                        onClick={() => {
                                            window.open(
                                                data.storeLink,
                                                "_blank"
                                            );
                                        }}
                                    >
                                        <img
                                            src={data.profilePicture}
                                            alt='creator profile image'
                                            className={styles.profileImg}
                                        />
                                        <div className={styles.instagramInfo}>
                                            <div className={styles.username}>
                                                {data.userName}
                                            </div>
                                            <div className={styles.followers}>
                                                {data.followers} Followers
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileFaymstoreCreatorsCarousel;
