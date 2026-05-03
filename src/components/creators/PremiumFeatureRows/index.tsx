import React, { ReactNode } from "react";
import styles from "./index.module.css";
import { handleButtonClick } from "../services/utils";

interface rowsProp {
    props: any;
    children: ReactNode;
}
const PremiumFeatureRows: React.FC<rowsProp> = ({ props, children }) => {
    return (
        <div
            id='features'
            className={styles.container}
            style={{
                flexDirection: props.reverseDirection ? "row-reverse" : "row",
                marginTop:
                    window.innerWidth <= 768 && props.tag === "Faym Wall"
                        ? "4em"
                        : "",
            }}
        >
            <div
                className={styles.phoneContainer}
                style={{
                    position: "relative",
                    marginRight:
                        window.innerWidth <= 1200
                            ? ""
                            : props.reverseDirection
                            ? "8%"
                            : "0%",
                    marginLeft:
                        window.innerWidth <= 1200
                            ? ""
                            : props.reverseDirection
                            ? "0%"
                            : "5%",
                }}
            >
                <img src={props.phoneImg} alt='' className={styles.phoneImg} />
                {children}
            </div>

            <div className={styles.contentBox}>
                <div className={styles.tag}>{props.tag}</div>
                <h2>
                    {props.heading.text}{" "}
                    <span className={styles.boldText}>
                        {props.heading.boldtext}
                    </span>
                </h2>
                <div className={styles.content}>
                    {props.bullets.map((item: any, index: number) => {
                        return (
                            <div key={index} className={styles.listItems}>
                                {props.showBullets ? (
                                    <img
                                        src='/assets/star_bullet.png'
                                        alt='tick'
                                    />
                                ) : (
                                    ""
                                )}
                                <p>{item.text}</p>
                            </div>
                        );
                    })}
                </div>
                <div
                    className={styles.redirectButton}
                    onClick={() =>handleButtonClick("")}
                >
                    <a
                        href=''
                        className={styles.redirectText}
                    >
                        {props.buttonText}
                    </a>
                    <img
                        src='/assets/redirectIcon.svg'
                        alt='arrow'
                        className={styles.redirectIcon}
                        loading='lazy'
                    />
                    <div className={styles.slidingOverlay0}></div>
                    <div className={styles.slidingOverlay1}></div>
                </div>
            </div>
        </div>
    );
};

export default PremiumFeatureRows;
