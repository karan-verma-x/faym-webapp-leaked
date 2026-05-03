import { useEffect, useState } from "react";
import { getAPIData } from "../../../service/utils";
import styles from "./index.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Brands } from "../../../DataModels/brands";
import { signToken } from "../../../service/cypher";

const BrandsCarouselSetion = () => {
    const [brands, setBrands] = useState<Brands[]>([]);
    const getBrands = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/brands/logos?type=normal",
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
        pauseOnHover: false,
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
        <div className={styles.brandsContainer} data-theme='light'>
            {window.innerWidth <= 500 ? (
                <div className={styles.heading}>
                    Level Up with Brands{" "}
                    <div className={styles.fontGradient}>
                        Handpicked Just for You.
                    </div>
                </div>
            ) : (
                <div className={styles.heading}>
                    Level Up with Brands Handpicked Just for You.
                </div>
            )}
            {window.innerWidth <= 500 ? (
                <div className={styles.description}>
                    Partnering with trending brands for
                    <div>impactful content</div>
                </div>
            ) : (
                <div className={styles.description}>
                    Partnering with trending brands for impactful content
                </div>
            )}
            <div className={styles.slider}>
                <Slider {...settings}>
                    {brands.map((e, i) => {
                        return (
                            <img
                                key={i}
                                src={e.brandLogo}
                                className={styles.logo}
                            />
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};

export default BrandsCarouselSetion;
