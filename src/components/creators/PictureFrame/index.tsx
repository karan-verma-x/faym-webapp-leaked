import React from "react";
import styles from "./index.module.css";
import { CreatorsAchievements } from "../../../DataModels/creators";

interface RotateProps {
    rotate: number;
    creator: CreatorsAchievements;
    fade: boolean;
    setIsHovered: (value: boolean) => void;
}

const PictureFrame: React.FC<RotateProps> = ({
    rotate,
    creator,
    fade,
    setIsHovered,
}) => {
    const rotation = Number(rotate);
    const style = {
        transform: `rotate(${window.innerWidth <= 769 ? -5 : rotation}deg)`,
    };
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div className={styles.container}>
            <img
                src='/assets/ribbons.gif'
                alt='Background GIF'
                className={styles.backgroundGif}
            />
            <div
                className={styles.frame}
                style={style}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles.tape}></div>
                <div
                    className={`${styles.imageContainer} ${
                        fade ? styles.fadeIn : styles.fadeOut
                    }`}
                    onClick={() =>
                        window.open(
                            `https://www.instagram.com/${creator.userName}`,
                            "_blank"
                        )
                    }
                >
                    <img
                        src={creator.image}
                        alt='Profile'
                        className={`${styles.image}`}
                    />
                    <div className={styles.overlay}></div>
                    <div className={styles.username}>@{creator.userName}</div>
                </div>
                <div
                    className={`${styles.achievement} ${
                        fade ? styles.fadeIn : styles.fadeOut
                    }`}
                    dangerouslySetInnerHTML={{ __html: creator.text }}
                ></div>
            </div>
        </div>
    );
};

export default PictureFrame;
