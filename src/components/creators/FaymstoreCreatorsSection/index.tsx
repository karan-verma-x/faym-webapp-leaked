import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import { StoreData } from "../../../DataModels/storeData";
import MobileFaymstoreCreatorsCarousel from "../MobileFaymstoreCreatorsSectionCarousel/index";
import { signToken } from "../../../service/cypher";

interface Props {
    index: number;
    data: StoreData;
}
export const StoreCard: React.FC<Props> = ({ index, data }) => {
    return (
        <div key={index} className={styles.creatorContainer} data-theme='light'>
            <div className={styles.cardContainer}>
                <div className={styles.card}>
                    <div className={styles.content}>
                        <div className={styles.front}>
                            <img
                                src={data.storeFrontImg}
                                alt='creator Faymstore'
                                className={styles.storeImg}
                            />
                        </div>
                        <div className={styles.back}>
                            <img
                                src={data.storeBackImg}
                                alt='creator Faymstore'
                                className={styles.storeImg}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={styles.instagramDetails}
                onClick={() => {
                    window.open(data.storeLink, "_blank");
                }}
            >
                <img
                    src={data.profilePicture}
                    alt='creator profile image'
                    className={styles.profileImg}
                />
                <div className={styles.instagramInfo}>
                    <div className={styles.username}>{data.userName}</div>
                    <div className={styles.followers}>
                        {data.followers} Followers
                    </div>
                </div>
            </div>
        </div>
    );
};

function FaymStoreCreators() {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        className: "center",
        verticalSwiping: true,
        autoplay: true,
        speed: 6000,
        autoplaySpeed: 200,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: 5,
                    infinite: true,
                },
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                    infinite: true,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1.25,
                    slidesToScroll: 1,
                },
            },
        ],
    };
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

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Build your Faym with Ease</h2>
            {window.innerWidth <= 500 ? (
                <p className={styles.subheading}>
                    Over 3,500+ Creators Monetize their
                    <br />
                    Links Everyday with Faym.
                </p>
            ) : (
                <p className={styles.subheading}>
                    Over 3,500+ Creators Monetize their Links Everyday with
                    Faym.
                </p>
            )}

            <div className={styles.subcontainer}>
                <div className={styles.overlay}></div>
                <div className={styles.slider}>
                    <Slider {...settings}>
                        {storeData.map((data: StoreData, index: number) => {
                            return (
                                <StoreCard
                                    key={index}
                                    index={index}
                                    data={data}
                                />
                            );
                        })}
                    </Slider>
                </div>
                <div className={styles.overlay2}></div>
            </div>
            <div className={styles.mobileCreatorsCarousel}>
                <MobileFaymstoreCreatorsCarousel />
            </div>
        </div>
    );
}

export default FaymStoreCreators;
