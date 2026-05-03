import { Key, useEffect, useState } from "react";
import { getAPIData } from "../../../service/utils";
import styles from "./index.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { signToken } from "../../../service/cypher";

const Brands = () => {
    const [brands, setBrands] = useState<any>([]);
    const getBrands = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/brands/logos",
                token: token,
            });
            if (response) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getBrands();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        arrows: false,
        responsive: [
            {
                breakpoint: 1030,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 770,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 570,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
        ],
    };

    return (
        <div className={styles.brandsContainer}>
            {window.innerWidth <= 500 ? (
                <div className={styles.heading}>
                    We work{" "}
                    <div className={styles.fontGradient}>with the Best</div>
                </div>
            ) : (
                <div className={styles.heading}>
                    We work{" "}
                    <span className={styles.fontGradient}>with the Best</span>
                </div>
            )}
            {window.innerWidth <= 500 ? (
                <div className={styles.description}>
                    Faym is the first choice for
                    <div>India’s top brands</div>
                </div>
            ) : (
                <div className={styles.description}>
                    Faym is the first choice for India’s top brands
                </div>
            )}
            <div className={styles.sideGradient}>
                <Slider {...settings}>
                    {brands.map(
                        (
                            e: { brandLogo: string | undefined },
                            i: Key | null | undefined
                        ) => {
                            return (
                                <img
                                    key={i}
                                    src={e.brandLogo}
                                    className={styles.logo}
                                />
                            );
                        }
                    )}
                </Slider>
            </div>
        </div>
    );
};

export default Brands;
