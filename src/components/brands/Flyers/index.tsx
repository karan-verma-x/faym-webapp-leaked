import { useEffect, useRef } from "react";
import styles from "./index.module.css";

const Flyers = () => {
    const otherData = [
        {
            text: "Struggle to steer the audience to your brand’s website.",
        },
        {
            text: "No content engagement leaves you behind.",
        },
        {
            text: "Lack of performance tracking.",
        },
        {
            text: "Hard to execute large-scale campaigns.",
        },
    ];
    const faymData = [
        {
            text: "Multiple link-sharing options enable better redirection to your platform.",
        },
        {
            text: "Automated Link Sharing via DMs with Faym Connect.",
        },
        {
            text: "Track influencer performance precisely.",
        },
        {
            text: "Execute optimised large-scale campaigns.",
        },
    ];

    const observedRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let otherFlyer = document.getElementById("flyer-other");
        let faymFlyer = document.getElementById("flyer-faym");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (window.innerWidth > 768 && otherFlyer && faymFlyer) {
                        if (entry.isIntersecting) {
                            otherFlyer.style.transform = "rotate(-5deg)";
                            otherFlyer.style.transition = "all 0.2s ease-in";
                            faymFlyer.style.transform = "rotate(5deg)";
                            faymFlyer.style.transition = "all 0.2s ease-in";
                        } else {
                            otherFlyer.style.transform = "rotate(0deg)";
                            otherFlyer.style.transition = "all 0.2s ease-in";
                            faymFlyer.style.transform = "rotate(0deg)";
                            faymFlyer.style.transition = "all 0.2s ease-in";
                        }
                    }
                });
            },
            {
                root: null, // Use the viewport as the container
                rootMargin: "0px",
                threshold: 0.9, // Trigger when 10% of the component is in view
            }
        );

        const currentElement = observedRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
                <h4>
                    We allow you to Break free {" "}
                    {window.innerWidth < 768 && <br />}
                    from the Ordinary
                </h4>
            </div>
            <div className={styles.flyer} ref={observedRef}>
                <div className={styles.others} id='flyer-other'>
                    <div className={styles.header}>
                        <h4>
                            Same Old Campaigns
                        </h4>
                    </div>
                    <hr />
                    <div className={styles.content}>
                        {otherData.map((item, index) => {
                            return (
                                <div key={index} className={styles.listItems}>
                                    <img src='/assets/cross.png' alt='cross' />
                                    <p>{item.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.circle}>
                    <p>vs</p>
                </div>
                <div className={styles.faym} id='flyer-faym'>
                    <div className={styles.header}>
                        <img src='/assets/faym_logo.png' alt='faym' />
                    </div>
                    <hr />
                    <div className={styles.content}>
                        {faymData.map((item, index) => {
                            return (
                                <div key={index} className={styles.listItems}>
                                    <img src='/assets/tick.png' alt='tick' />
                                    <p>{item.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Flyers;
