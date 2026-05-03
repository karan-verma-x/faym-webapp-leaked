import styles from "./index.module.css";
import AnimatedNumbers from "react-animated-numbers";
import {
    getAPIData,
    splitStringIntoNonNumber,
    splitStringIntoNumber,
} from "../../../service/utils";
import { useEffect, useState } from "react";
import { Stat } from "../../../DataModels/stats";
import { signToken } from "../../../service/cypher";
const StatsComponent = () => {
    const [stats, setStats] = useState<Stat[]>([]);

    const getStats = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/stats/info",
                token: token,
            });
            if (response) {
                setStats(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);

    let animatedStyles = {
        fontFamily: "Arial",
        fontSize:
            window.innerWidth > 1222
                ? "calc(49px + 2vw)"
                : window.innerWidth > 1063
                ? "calc(40px + 2vw)"
                : window.innerWidth > 846
                ? "calc(39px + 2vw)"
                : window.innerWidth > 480
                ? "calc(49px + 2vw)"
                : "38px",
        background: "linear-gradient(135deg, #A1FF8B 0%, #3F93FF 96.83%)",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        lineHeight:
            window.innerWidth > 1222
                ? "99.04px"
                : window.innerWidth > 1063
                ? "95px"
                : window.innerWidth > 846
                ? "85px"
                : window.innerWidth > 480
                ? "99.04px"
                : "44.57px",
    };

    return (
        <div className={styles.container}>
            {window.innerWidth <= 500 ? (
                <div className={styles.heading}>
                    True ROI-Driven
                    <div className={styles.fontGradient}>
                        Influencer Marketing
                    </div>
                </div>
            ) : (
                <div className={styles.heading}>
                    True ROI-Driven&nbsp;
                    <span className={styles.fontGradient}>
                        Influencer Marketing
                    </span>
                </div>
            )}
            <div className={styles.description}>
                {window.innerWidth <= 500 ? (
                    <>
                        {" "}
                        Bring your audience to the playground
                        <div>of monetization</div>
                    </>
                ) : (
                    <> Bring your audience to the playground of monetization</>
                )}
            </div>
            <div className={styles.grid}>
                {stats.map((e, i) => {
                    return (
                        <div className={styles.gridItem} key={i}>
                            <img
                                src={e.icon}
                                alt=''
                                className={styles.imgIcons}
                            />
                            <div className={styles.statsContent}>
                                <div className={styles.statsBox}>
                                    <AnimatedNumbers
                                        transitions={(index) => ({
                                            type: "spring",
                                            duration: index + 0.3,
                                        })}
                                        animateToNumber={splitStringIntoNumber(
                                            e.stats
                                        )}
                                        fontStyle={animatedStyles}
                                    />
                                    <div className={styles.numbersSuffix}>
                                        {splitStringIntoNonNumber(e.stats)}
                                    </div>
                                </div>
                                <div className={styles.text}>{e.name}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsComponent;
