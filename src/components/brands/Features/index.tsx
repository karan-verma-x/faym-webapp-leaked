import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactGA from "react-ga4";
import mixpanel from "mixpanel-browser";
import { useLocation } from "react-router-dom";
import { Comment } from "../../../DataModels/comments";
import { signToken } from "../../../service/cypher";

const Features = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const location = useLocation();
    const referral = window.location.search;

    const getComments = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/comments",
                token: token,
            });
            if (response) {
                setComments(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    const verticleSetting = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
    };

    const content = [
        {
            id: 1,
            header: "Introducing Faym Vue Analytical Suite",
            content:
                "Faym Vue is packed with easy-to-understand analytics that'll help you turn raw data into actionable insights.<br/> Stay ahead with detailed metrics on product sales, creator performance, and overall campaign success, driving smarter, data-driven decisions.",

            image: {
                web: "/assets/dashboard1.png",
                mobile: "/assets/dashboard1-mobile.png",
            },
        },
        {
            id: 2,
            header: "Powered by Data Backed Creator discovery",
            content:
                "Faym Vue’s intelligent database sorts through mountains of data to pinpoint the creators that align with your brand’s vision. <br/>Launch high-impact campaigns confidently, knowing you’ve got the right creators, curated just for your Brand.",
            image: {
                web: "/assets/dashboard2.png",
                mobile: "/assets/dashboard2-mobile.png",
            },
        },
        {
            id: 2,
            header: "Tech-Powered, Creativity-Driven",
            content:
                "We design campaigns that not only attract the eyes but also drive real engagement, turning your brand stories into powerful, conversion-driven narratives.",
            image: {
                web: "/assets/dashboard3.png",
                mobile: "/assets/dashboard3-mobile.png",
            },
        },
    ];

    return (
        <div id='features' className={styles.wrapper}>
            <div className={styles.topContainer}>
                <h4>
                    The Tech behind {window.innerWidth < 768 && <br />}
                    <span>“Tech-Enabled Influencer Marketing”</span>
                </h4>
                <p>
                    Introducing Faym Vue & Faym Connect for Optimized campaigns.
                </p>
            </div>
            <img
                src='/assets/topographic1.webp'
                className={styles.topographicImg1}
                alt=''
            />
            <img
                src='/assets/topographic2.webp'
                className={styles.topographicImg2}
                alt=''
            />
            <img
                src='/assets/topographic3.webp'
                className={styles.topographicImg3}
                alt=''
            />

            <div className={styles.bottomContainer}>
                {content.map((item, index) => (
                    <div
                        key={index}
                        className={styles.row}
                        style={
                            window.innerWidth > 768
                                ? {
                                      alignSelf:
                                          index % 2 === 1
                                              ? "flex-start"
                                              : "flex-end",
                                      flexDirection:
                                          index % 2 === 1
                                              ? "row-reverse"
                                              : "row",
                                  }
                                : {}
                        }
                    >
                        <div className={styles.textContainer}>
                            <h4>{item.header}</h4>
                            <p>
                                {item.content
                                    .split("<br/>")
                                    .map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                            </p>
                            <button
                                className={styles.bookDemoButton}
                                onClick={() => {
                                    ReactGA.event({
                                        category: `DEMO ${item.id}`,
                                        action: "Clicked on book a demo",
                                        label:
                                            location +
                                            " | " +
                                            referral.split("=")[1],
                                    });
                                    mixpanel.track("contact us", {
                                        category: `DEMO ${item.id}`,
                                        action: "Clicked on book a demo",
                                    });
                                    (window as any).Calendly?.initPopupWidget({
                                        url: `https://calendly.com/admin-faym/30min?hide_landing_page_details=1&hide_gdpr_banner=1`,
                                    });
                                }}
                            >
                                Book a Demo
                                <div className={styles.slidingOverlay0}></div>
                                <div className={styles.slidingOverlay1}></div>
                            </button>
                        </div>
                        <img
                            src={
                                window.innerWidth <= 768
                                    ? item.image.mobile
                                    : item.image.web
                            }
                            className={styles.dashboard}
                            alt='img'
                        />
                    </div>
                ))}
            </div>

            <div className={styles.row2}>
                <div className={styles.dmInfo}>
                    <div className={styles.info}>
                        <h4>Auto Link Sharing via Faym Connect</h4>
                        <p>
                            With Faym Connect, share Product Links Automatically
                            via DMs, enabling an enhanced link-sharing process,
                            higher website conversion, and unmatched creator
                            engagement rate!
                        </p>
                    </div>
                </div>
                <div className={styles.comments}>
                    <Slider {...verticleSetting}>
                        {comments?.map((item) => {
                            return (
                                <img
                                    key={item._id}
                                    src={item.image}
                                    alt='comments'
                                    className={styles.commentImg}
                                />
                            );
                        })}
                    </Slider>
                </div>
                <div className={styles.messenger}>
                    <img src='/assets/messenger.png' alt='messenger' />
                </div>
            </div>
            <div className={styles.overlay}></div>
        </div>
    );
};

export default Features;
