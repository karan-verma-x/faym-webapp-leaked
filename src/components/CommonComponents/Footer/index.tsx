import { useState } from "react";
import styles from "./index.module.css";
import { isAndroid, isMobile } from "react-device-detect";

const Footer = () => {
    const data = [
        {
            name: "Razor Pay",
            blankImage: "/assets/razorpay_blank.png",
            colorImage: "/assets/razorpay_color.png",
        },
        {
            name: "Start Up India",
            blankImage: "/assets/startupindia_blank.png",
            colorImage: "/assets/startupindia_color.png",
        },
        {
            name: "Enterpreneur",
            blankImage: "/assets/entrepreneur_blank.png",
            colorImage: "/assets/entrepreneur_color.png",
        },
    ];

    const socailMedia = [
        {
            socailMediaName: "Instagram",
            icon: "/assets/instagram-white.svg",
            link: "https://instagram.com/faym.co",
        },
        {
            socailMediaName: "Linkedin",
            icon: "/assets/linkedin.svg",
            link: "https://in.linkedin.com/company/getfaym",
        },
    ];

    const footerNav = [
        {
            title: "Home",
            link: "/",
        },
        {
            title: "Creators",
            link: "/creators",
        },
        {
            title: "Brands",
            link: "/",
        },
        // {
        //     title: "Features",
        //     link: "#features",
        // },
    ];

    const [mouseEnter, setMouseEnter] = useState({
        mouseHover: false,
        name: "",
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.row1}>
                {data.map((item, index) => {
                    return (
                        <img
                            key={index}
                            src={`${
                                mouseEnter && mouseEnter?.name !== item.name
                                    ? item.blankImage
                                    : item.colorImage
                            }`}
                            style={{marginTop: item.name=="Start Up India"? "11px":""}}
                            alt={item.name}
                            onMouseEnter={() =>
                                setMouseEnter({
                                    mouseHover: !mouseEnter,
                                    name: item.name,
                                })
                            }
                            onMouseLeave={() =>
                                setMouseEnter({
                                    mouseHover: !mouseEnter,
                                    name: "",
                                })
                            }
                        />
                    );
                })}
            </div>
            <div className={styles.row2}>
                <img src='/assets/qr_code.png' alt='qr code' />
                <p>Download Faym</p>
            </div>

            {isMobile ? (
                <div className={styles.row3}>
                    <div className={styles.navItems}>
                        {footerNav.map((item, index) => {
                            return (
                                <a key={index} href={item.link}>
                                    {item.title}
                                </a>
                            );
                        })}
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.socialMediaContainer}>
                            {socailMedia.map((item, index) => {
                                return (
                                    <a
                                        href={item.link}
                                        key={index}
                                        target='_blank'
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.socailMediaName}
                                        />
                                    </a>
                                );
                            })}
                        </div>
                        <div className={styles.customerSupport}>
                            <a href='tel:+91 83683 93419'>+91 83683 93419</a>{" "}
                            <p>|</p>{" "}
                            <a href='mailto:support@faym.co'>support@faym.co</a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.row3}>
                    <div className={styles.navItems}>
                        {footerNav.map((item, index) => {
                            return (
                                <a key={index} href={item.link}>
                                    {item.title}
                                </a>
                            );
                        })}
                    </div>

                    <div className={styles.socialMediaContainer}>
                        {socailMedia.map((item, index) => {
                            return (
                                <a href={item.link} key={index} target='_blank'>
                                    <img
                                        src={item.icon}
                                        alt={item.socailMediaName}
                                    />
                                </a>
                            );
                        })}
                    </div>
                    <div className={styles.customerSupport}>
                        <a href='tel:+91 83683 93419'>+91 83683 93419</a>{" "}
                        <p>|</p>{" "}
                        <a href='mailto:support@faym.co'>support@faym.co</a>
                    </div>
                </div>
            )}
            <div className={styles.downloadBtnWrapper}>
                <a
                    href={
                        isAndroid
                            ? "https://play.google.com/store/apps/details?id=com.application.faym"
                            : "https://apps.apple.com/in/app/faym/id6479986552"
                    }
                    target='_blank'
                >
                    DOWNLOAD FAYM
                    <img src='/assets/redirectIcon.svg' alt='arrow' />
                </a>
            </div>
            <div className={styles.row4}>
                <h5>
                    Copyright © 2024 postfaym technologies | All Rights Reserved
                    |{" "}
                    <span>
                        <a href='/tnc' target='_blank'>
                            Privacy Policy
                        </a>
                    </span>
                </h5>
            </div>
        </div>
    );
};

export default Footer;
