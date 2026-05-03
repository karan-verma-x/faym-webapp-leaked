import { useEffect, useState } from "react";
import styles from "./index.module.css";

const Index = () => {
    function startCountdown(updateCallback: (time: string) => void) {
        function updateTimer() {
            const now: Date = new Date();

            // Tomorrow midnight (end of today)
            const tomorrowMidnight: Date = new Date();
            tomorrowMidnight.setHours(24, 0, 0, 0);

            // Difference in ms
            const diff = tomorrowMidnight.getTime() - now.getTime();

            if (diff <= 0) {
                updateCallback("00h:00m:00s");
                clearInterval(timer);
                return;
            }

            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(
                2,
                "0"
            );
            const minutes = String(
                Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            ).padStart(2, "0");
            const seconds = String(
                Math.floor((diff % (1000 * 60)) / 1000)
            ).padStart(2, "0");

            updateCallback(`${hours}h:${minutes}m:${seconds}s`);
        }

        updateTimer(); // run immediately
        const timer = setInterval(updateTimer, 1000);
    }

    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        startCountdown(setTimeLeft);
    }, []);

    return (
        <div className={styles.heroSection}>
            <img
                className={styles.heroSectionBackground}
                src='/assets/dealsPage/hero-section.png'
                alt='Hero Section Background'
            />
            <div className={styles.heroSectionDescription}>
                NEW HOT DEALS, EVERY DAY.
            </div>
            <div className={styles.timerContainer}>
                <div className={styles.timerText}>Ends in</div>
                <div className={`${styles.timerText} ${styles.timer}`}>
                    {timeLeft}
                </div>
            </div>
        </div>
    );
};

export default Index;
