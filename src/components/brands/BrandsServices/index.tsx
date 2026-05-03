import { SetStateAction, useEffect, useState } from "react";
import styles from "./index.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common.css";
import { getAPIData } from "../../../service/utils";
import { BrandsServices } from "../../../DataModels/brandsServices";
import { signToken } from "../../../service/cypher";

const Index = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState<BrandsServices[]>([]);

    const getMobileData = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/mobile/info",
                token: token,
            });
            if (response) {
                setData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMobileData();
    }, []);

    useEffect(() => {
        if (window.innerWidth > 600) {
            const interval = setInterval(() => {
                data[currentIndex].hidden = true;

                if (currentIndex + 1 === data.length) {
                    data[0].hidden = false;
                } else {
                    data[currentIndex + 1].hidden = false;
                }

                setCurrentIndex((currentIndex + 1) % data.length);
            }, 1000 * 10);

            return () => clearInterval(interval);
        }
    });

    const settings = {
        infinite: true,
        speed: 600,
        arrows: false,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 10000,
                    afterChange: (current: SetStateAction<number>) =>
                        setCurrentIndex(current),
                },
            },
        ],
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h4>
                    Bespoke <span>Services for Brands</span>
                </h4>
                <p>
                    A one-stop shop for all your influencer marketing solution
                </p>
            </div>
            <div className={styles.container}>
                <div className={styles.accordianContainer}>
                    {data.map((item, index) => {
                        return (
                            <div key={index} className={styles.accordian}>
                                <h4
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        data[index].hidden = false;
                                        data[currentIndex].hidden = true;
                                    }}
                                    style={{
                                        color: item.hidden ? "grey" : "#FFFFFF",
                                        cursor: item.hidden
                                            ? "pointer"
                                            : "text",
                                    }}
                                >
                                    {item.heading}
                                </h4>
                                <div
                                    className={`${
                                        item.hidden
                                            ? styles.accordianContent
                                            : styles.accordianActive
                                    }`}
                                >
                                    <p>{item.content}</p>
                                    <a
                                        href='#contactus'
                                        className={styles.accordiaRedirectBtn}
                                    >
                                        Know More
                                        <img
                                            src='/assets/redirectIcon.svg'
                                            alt='arrow'
                                            loading='lazy'
                                        />
                                        <div
                                            className={styles.slidingOverlay0}
                                        ></div>
                                        <div
                                            className={styles.slidingOverlay1}
                                        ></div>
                                    </a>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progress}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.carousal}>
                        <Slider {...settings}>
                            {data.map((item, index) => {
                                return (
                                    <div key={index} className={styles.slider}>
                                        <h4>{item.heading}</h4>
                                        <p>{item.content}</p>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
                <div className={styles.mobileScreenContainer}>
                    <img
                        src='/assets/mobile.png'
                        alt='mobile screen'
                        loading='lazy'
                        className={styles.mobile}
                    />
                    <img
                        src={data[currentIndex]?.video}
                        alt='reel'
                        className={styles.mobileReel}
                    />
                    {data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={styles.progressWrapper}
                                style={{
                                    display:
                                        index === currentIndex
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <h4>{data[currentIndex]?.heading}</h4>
                                <div className={styles.progressBarMobile}>
                                    <div
                                        className={styles.progressMobile}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Index;
