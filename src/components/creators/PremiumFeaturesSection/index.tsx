import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import PremiumFeatureRows from "../PremiumFeatureRows";
import ThemeCards from "../ThemeCards/index";
import { signToken } from "../../../service/cypher";

function PremiumFeaturesSection() {
    const [themes, setThemes] = useState<string[]>([]);

    const getThemes = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/themes",
                token: token,
            });
            if (response) {
                setThemes(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getThemes();
    }, []);

    const data = [
        {
            tag: "Faym Store",
            heading: {
                text: "Standout with Your ",
                boldtext: "Customised Digital Store",
            },
            showBullets: true,
            reverseDirection: false,
            phoneImg: "/assets/faymstore_phone.png",
            bullets: [
                {
                    text: "Upto 25% Commission on Every Sale",
                },
                {
                    text: "Free Product Sourcing Directly from Brands",
                },
                {
                    text: "Live Analytics and Earnings",
                },
                {
                    text: "Live Analytics and Earnings",
                },
                {
                    text: "50+ Top Partner Brands",
                },
            ],
            buttonText: "Join in for Free",
        },
        {
            tag: "Faym Wall",
            heading: {
                text: "Your Bio Needs",
                boldtext: "Only One Link, Faym Wall",
            },
            showBullets: true,
            reverseDirection: true,
            phoneImg: "/assets/faymwall_phone.png",
            bullets: [
                {
                    text: "Unlimited Links at Absolutely No Cost",
                },
                {
                    text: "Well-designed Interface with Countless Themes",
                },
                {
                    text: "Detailed Insights and Analytics",
                },
                {
                    text: "Direct redirection to Apps & Browser",
                },
            ],
            buttonText: "Let's Dive in",
        },
        {
            tag: "Brand Deals",
            heading: {
                text: "Never Run Low on ",
                boldtext: "Brand Deals!",
            },
            showBullets: false,
            reverseDirection: false,
            phoneImg: "/assets/brands_phone.png",
            bullets: [
                {
                    text: "Grab paid influencer marketing campaigns from your favorite brands without any hassle.",
                },
                {
                    text: "With over 100+ top partner brands like Myntra, H&M, Ajio, Meesho, BoAt and more, stand to earn commission on every sale you make on your Faym Store.",
                },
            ],
            buttonText: "Try Faym for free",
        },
    ];

    return (
        <div className={styles.container} data-theme='dark'>
            {window.innerWidth <= 500 ? (
                <div className={styles.heading}>
                    Unlock Premium Features <div>at NO COST</div>
                </div>
            ) : (
                <div className={styles.heading}>
                    Unlock Premium Features at NO COST.
                </div>
            )}
            {window.innerWidth <= 500 ? (
                <div className={styles.description}>
                    Bring Your Audience to the Playground
                    <div>of Monetization</div>
                </div>
            ) : (
                <div className={styles.description}>
                    Bring Your Audience to the Playground of Monetization
                </div>
            )}

            <div className={styles.content}>
                {data.map((item, index) => {
                    return (
                        <div key={index} className={styles.feature}>
                            <PremiumFeatureRows props={item}>
                                {item.tag === "Faym Store" && (
                                    <div className={styles.faymstoreStats}>
                                        <img
                                            src='/assets/stats2.png'
                                            alt=''
                                            className={styles.stats2}
                                        />
                                        <div className={styles.gifContainer}>
                                            <img
                                                src='/assets/money_gif.gif'
                                                alt=''
                                                className={styles.gif1}
                                            />
                                            <img
                                                src='/assets/stats3.png'
                                                alt=''
                                                className={styles.stats3}
                                            />
                                            <img
                                                src='/assets/money_gif.gif'
                                                alt=''
                                                className={styles.gif2}
                                            />
                                        </div>
                                    </div>
                                )}
                                {item.tag === "Faym Wall" && (
                                    <div className={styles.faymwallThemes}>
                                        <ThemeCards themes={themes} />
                                        <img
                                            src='/assets/growth_img.png'
                                            alt=''
                                            className={styles.growthImg}
                                        />
                                    </div>
                                )}
                                {item.tag === "Brand Deals" && (
                                    <div className={styles.brandDealsBanner}>
                                        <img
                                            src='/assets/brandbanner1.png'
                                            alt=''
                                            className={styles.brandbanner}
                                        />
                                        <img
                                            src='/assets/brandbanner2.png'
                                            alt='brands '
                                            className={styles.brandbanner}
                                        />
                                    </div>
                                )}
                            </PremiumFeatureRows>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PremiumFeaturesSection;
