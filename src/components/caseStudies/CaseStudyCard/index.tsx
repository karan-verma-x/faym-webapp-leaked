import React from "react";
import styles from "./index.module.css";
import ReactGA from "react-ga4";
import mixpanel from "mixpanel-browser";
import { CaseStudy } from "../../../DataModels/caseStudies";
interface prop {
    item: CaseStudy;
}

const Index: React.FC<prop> = ({ item }) => {
    const handleClick = () => {
        ReactGA.event({
            category: "Case study",
            action: "Opened case study",
            label: `${item.brandName}`,
        });
        mixpanel.track("contact us", {
            category: "Case study",
            action: "Opened case study",
            label: `${item.brandName}`,
        });
        window.open(
                    `/casestudies/${item.brandName}/${item.id}`,
                    "_blank"
                )
    };
    return (
        <div
            onClick={() =>
                handleClick()
            }
            className={styles.item}
            style={{ backgroundColor: `${item?.color}` }}
        >
            <img src={item?.images?.brandIcon} alt='brand icon' />
            {item?.milestones[0] && (
                <div className={styles.milestone}>
                    <span>{item?.milestones[0].stats} </span>
                    <span>{item?.milestones[0].title}</span>
                </div>
            )}
        </div>
    );
};

export default Index;