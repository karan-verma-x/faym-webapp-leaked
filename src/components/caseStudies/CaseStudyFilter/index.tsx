import React, { Dispatch, SetStateAction } from "react";
import styles from "./index.module.css";
import { Filter } from "../../../DataModels/caseStudies";

interface props {
    option: Filter;
    selectedOption: String;
    setSelectedOption: Dispatch<SetStateAction<String>>;
}

const Index: React.FC<props> = ({
    option,
    selectedOption,
    setSelectedOption,
}) => {
    const greyScaleIcon = { filter: "grayscale(0%)" };
    const selectedFilterOptionStyle = {
        background: "#E6323833",
        border: "1px solid #E63238",
    };

    return (
        <div
            className={styles.options}
            onClick={() => {
                setSelectedOption(option.filterName);
            }}
            style={
                option.filterName === selectedOption
                    ? selectedFilterOptionStyle
                    : {}
            }
        >
            <img
                src={option.iconActive}
                alt='3dicon'
                className={styles.filterIcon}
                style={
                    option.filterName === selectedOption ? greyScaleIcon : {}
                }
            />
            <div className={styles.text}>{option.filterName}</div>
        </div>
    );
};

export default Index;
