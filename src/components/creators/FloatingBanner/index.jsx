import React from "react";
import styles from "./index.module.css";

const index = ({onClick}) => {
  return (
    <div className={styles.bannerContainer}>
      <img className={styles.coinsBg1} src= '/assets/coinsBg.png' />
      <img className={styles.coinsBg2} src= '/assets/coinsBg.png'/>
      <div className={styles.banner}>
        <span className={styles.bannerText}>INDIA’s only platform with highest <span className={styles.bannerTextHighlight}>Commissions</span></span>
        <div className={styles.bannerButton} onClick={onClick}>
          <span className={styles.bannerButtonText}>Get Started</span>
          <img className={styles.bannerButtonArrow} src= '/assets/arrowGreen.png'/>
        </div>
      </div>
    </div>
  );
};

export default index;
