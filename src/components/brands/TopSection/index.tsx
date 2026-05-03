import { Key, useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common.css";
import { signToken } from "../../../service/cypher";

const TopSection = () => {
    const [data, setData] = useState<any[]>([]);

    const getFrameData = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/frame/images",
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
        getFrameData();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 100,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
    };
    const settings2 = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: -1,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 100,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
    };

    return (
        <div className={styles.container}>
            <div className={styles.headingContainer}>
                <h1>
                    Weaving Content<br></br>with Commerce
                </h1>
                <h2 className={styles.subheading}>
                    Set up your products in 10,000+ creators'<br></br>stores to
                    boost your sales.
                </h2>
                <a href='#contactus' className={styles.redirectLink}>
                    <div className={styles.redirectButton}>
                        <p className={styles.redirectText}>Let's Connect</p>
                        <img
                            src='/assets/redirectIcon.svg'
                            alt='arrow'
                            className={styles.redirectIcon}
                            loading='lazy'
                        />
                        <div className={styles.slidingOverlay0}></div>
                        <div className={styles.slidingOverlay1}></div>
                    </div>
                </a>
            </div>
            <div className={styles.animationContainer}>
                <div className={`${styles.column1} ${styles.column}`}>
                    <Slider {...settings}>
                        {data.length > 0 &&
                            data[0]?.map(
                                (
                                    item: string | undefined,
                                    index: Key | null | undefined
                                ) => {
                                    return (
                                        <img
                                            key={index}
                                            src={item}
                                            alt='frame image'
                                            className={styles.frameImage}
                                            loading='lazy'
                                        />
                                    );
                                }
                            )}
                    </Slider>
                </div>
                <div className={`${styles.column2} ${styles.column}`}>
                    <Slider {...settings2}>
                        {data.length > 0 &&
                            data[1]?.map(
                                (
                                    item: string | undefined,
                                    index: Key | null | undefined
                                ) => {
                                    return (
                                        <img
                                            key={index}
                                            src={item}
                                            alt='frame image'
                                            className={styles.frameImage}
                                            loading='lazy'
                                        />
                                    );
                                }
                            )}
                    </Slider>
                </div>
                <div className={`${styles.column3} ${styles.column}`}>
                    <Slider {...settings}>
                        {data.length > 0 &&
                            data[2]?.map(
                                (
                                    item: string | undefined,
                                    index: Key | null | undefined
                                ) => {
                                    return (
                                        <img
                                            key={index}
                                            src={item}
                                            alt='frame image'
                                            className={styles.frameImage}
                                            loading='lazy'
                                        />
                                    );
                                }
                            )}
                    </Slider>
                </div>
                <div className={`${styles.column4} ${styles.column}`}>
                    <Slider {...settings2}>
                        {data.length > 0 &&
                            data[3]?.map(
                                (
                                    item: string | undefined,
                                    index: Key | null | undefined
                                ) => {
                                    return (
                                        <img
                                            key={index}
                                            src={item}
                                            alt='frame image'
                                            className={styles.frameImage}
                                            loading='lazy'
                                        />
                                    );
                                }
                            )}
                    </Slider>
                </div>
                <div className={`${styles.column5} ${styles.column}`}>
                    <Slider {...settings}>
                        {data.length > 0 &&
                            data[4]?.map(
                                (
                                    item: string | undefined,
                                    index: Key | null | undefined
                                ) => {
                                    return (
                                        <img
                                            key={index}
                                            src={item}
                                            alt='frame image'
                                            className={styles.frameImage}
                                            loading='lazy'
                                        />
                                    );
                                }
                            )}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default TopSection;
