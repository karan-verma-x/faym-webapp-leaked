import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FlippingCard from "../FllipingCard";
import { Brands } from "../../../DataModels/brands";
import { signToken } from "../../../service/cypher";

function MonetizeSalesSection() {
    const [brands, setBrands] = useState<Brands[]>([]);
    const [products, setProducts] = useState<string[]>([]);
    const [stats, setStats] = useState<string[]>([]);

    const getBrands = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/brands/logos?type=circular",
                token: token,
            });
            if (response) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getProductsAndStats = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/products",
                token: token,
            });
            if (response) {
                setProducts(response.data.products);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getBrands();
        getProductsAndStats();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        verticalSwiping: true,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 100,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
    };

    return (
        <section className={styles.container} data-theme='light'>
            <div className={styles.row1}>
                <div className={styles.faymStore}>
                    <div className={styles.textBox}>
                        <div className={styles.tags}>Faym Store</div>
                        <h2>Step into the Monetization Playground!</h2>
                        <p>
                            Integrate your products seamlessly in one tap,
                            earning up to 25% commission on each sale from top
                            brands.
                        </p>
                    </div>
                </div>
                <div className={styles.phoneImg}>
                    <img
                        src='/assets/phone_img.png'
                        alt='phone img'
                        style={{ width: "98%", minHeight: "50%" }}
                    />
                    <img
                        src='/assets/coins_gif.gif'
                        className={styles.coins1}
                    />
                    <img
                        src='/assets/coins_gif.gif'
                        className={styles.coins2}
                    />
                </div>
            </div>

            <div className={styles.row2}>
                <div className={styles.subContainer}>
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
                    <div className={styles.tags}>Brand Deals</div>
                    <h2>Access Top Brands around the Block</h2>
                </div>

                <div className={styles.subContainer}>
                    <div className={styles.commentbox}>
                        <img
                            src='/assets/comment1.png'
                            alt='comment image'
                            className={styles.commentimg1}
                        />
                        <img
                            src='/assets/comment2.png'
                            alt='comment image'
                            className={styles.commentimg2}
                        />
                    </div>
                    <div className={styles.tags}>Automated Link Sharing</div>
                    <h2>Share Product Links Automatically via DMs</h2>
                </div>
            </div>

            <div className={styles.row3}>
                <div className={styles.faymwall}>
                    <div className={styles.textBox}>
                        <div className={styles.tags}>Faym Wall</div>
                        <h2>One Link.</h2>
                        <h2>Infinite Possibilties.</h2>
                        <p>
                            Showcase your best work, brand deals, collabs,
                            storefronts, products, and beyond in just one link.
                        </p>
                    </div>
                </div>
                <div className={styles.creator} style={{ display: "flex" }}>
                    <div className={styles.flipcard}>
                        <div className={styles.card1}>
                            <FlippingCard images={products} />
                        </div>
                        <div className={styles.card2}>
                            <FlippingCard images={stats} />
                        </div>
                    </div>
                    <div className={styles.creatorCard}>
                        <img
                            src='/assets/Karishma Rajput.png'
                            alt='phone img'
                        />
                        <img
                            src='/assets/growth_img.png'
                            alt='growth img'
                            className={styles.growthImg}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MonetizeSalesSection;
