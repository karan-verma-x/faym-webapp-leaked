import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import PictureFrame from "../PictureFrame";
import { getAPIData } from "../../../service/utils";
import { CreatorsAchievements } from "../../../DataModels/creators";
import { handleButtonClick } from "../services/utils";
import { signToken } from "../../../service/cypher";

const HeroSection: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [creators, setCreators] = useState<CreatorsAchievements[]>([]);

    const getCreatorsAchievements = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/creators/achievements",
                token: token,
            });
            if (response) {
                setCreators(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCreatorsAchievements();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("test");
        const value = e.currentTarget.value.trim().toLowerCase();
        const regex = /^[a-z0-9_]{3,20}$/;
        setInputValue(value);
        setIsDisabled(!regex.test(value));
    };

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % creators.length
                );
                setFade(true);
            }, 300);
        }, 3500);

        return () => clearInterval(interval);
    }, [creators.length, isHovered]);

    return (
        <div className={styles.container} data-theme='light'>
            <img
                src='/assets/3dcoins.gif'
                alt='coins gif'
                className={styles.coinsGif}
            />
            <div>
                <div className={styles.heading}>
                    <p>
                        {" "}
                        Built To{" "}
                        <span className={styles.monetize}> Monetize</span>
                        <br /> Your Influence
                    </p>
                    <img src='/assets/underline.png' alt='' />
                </div>
                {window.innerWidth <= 769 ? (
                    <p className={styles.subheading}>
                        Thousands of Creator monetise their content
                        <br /> everyday with Faym
                    </p>
                ) : (
                    <p className={styles.subheading}>
                        Thousands of Creator monetise their content everyday
                        with Faym
                    </p>
                )}
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                    <span className={styles.staticText}>faym.co/i/</span>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder='yourname'
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isDisabled) {
                                handleButtonClick(inputValue);
                                setInputValue("");
                                setIsDisabled(true);
                            }
                        }}
                    />
                    <img
                        src='/assets/tick_mark.png'
                        alt='tickmark'
                        className={styles.tick}
                        style={{ opacity: isDisabled ? "0" : "1" }}
                    />
                </div>
                <button
                    className={`${styles.button} ${
                        isDisabled ? "" : styles.buttonActive
                    }`}
                    onClick={() => {
                        handleButtonClick(inputValue);
                        setInputValue("");
                        setIsDisabled(true);
                    }}
                    disabled={isDisabled}
                >
                    Claim your Store
                </button>
            </div>
            {creators.length > 0 && (
                <>
                    <div className={styles.creator}>
                        <PictureFrame
                            rotate={-20}
                            creator={creators[currentIndex]}
                            fade={fade}
                            setIsHovered={setIsHovered}
                        />
                    </div>
                    <div className={styles.creator2}>
                        <PictureFrame
                            rotate={20}
                            creator={
                                creators[(currentIndex + 3) % creators.length]
                            }
                            fade={fade}
                            setIsHovered={setIsHovered}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroSection;
