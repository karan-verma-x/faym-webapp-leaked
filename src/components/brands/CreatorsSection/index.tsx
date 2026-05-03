import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Carousel from "../CreatorsSectionCarousel";
import { getAPIData } from "../../../service/utils";
import { Creator } from "../../../DataModels/creators";
import { signToken } from "../../../service/cypher";
const CreatorsCarousel = () => {
    // const [selectedIndex, setSelectedIndex] = useState(0);
    // const creatorsCategories = ["Fashion", "Tech", "Beauty", "Finance"];
    const [creatorsResponse, setCreatorsResponse] = useState<Creator[]>([]);

    const getCreators = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({url: "api/website/creators/info", token: token});
            if (response) {
                setCreatorsResponse(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCreators();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.containerHeadingSection}>
                {window.innerWidth <= 500 ? (
                    <div className={styles.heading}>
                        Sneak A Peek at
                        <div className={styles.containerHeadingHighlight}>
                            Our Creators
                        </div>
                    </div>
                ) : (
                    <div className={styles.heading}>
                        Sneak A Peek at&nbsp;
                        <span className={styles.containerHeadingHighlight}>
                            Our Creators
                        </span>
                    </div>
                )}
                {window.innerWidth > 819 && (
                    <a
                        href='https://instagram.com/faym.co'
                        className={styles.followUsButton}
                        target='_blank'
                    >
                        <img
                            className={styles.followUsButtonImage}
                            src='/assets/instagram-white.svg'
                        />
                        Follow Us
                    </a>
                )}
            </div>
            {/* This code might be needed later, so let it be commented. */}
            {/* <div className={styles.navBar}>
                {creatorsCategories.map((e, i) => {
                    return (
                        <div
                            key={i}
                            className={
                                i === selectedIndex
                                    ? styles.selectedNavBarItem
                                    : styles.navBarItem
                            }
                            onClick={() => setSelectedIndex(i)}
                        >
                            <p>{e}</p>
                        </div>
                    );
                })}
            </div> */}

            <Carousel creators={creatorsResponse} />
        </div>
    );
};

export default CreatorsCarousel;
