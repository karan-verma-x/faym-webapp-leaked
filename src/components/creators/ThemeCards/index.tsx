import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

interface themeProps {
    themes: string[];
}

const ThemeCards: React.FC<themeProps> = ({ themes }) => {
    const [cards, setCards] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shift, setShift] = useState(true);

    useEffect(() => {
        setCards(themes);
    }, [themes]);

    const handleSwap = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setShift(false);

        setTimeout(() => {
            setTimeout(() => {
                setIsAnimating(false);
                const newCards = [...cards];
                const lastCard = newCards.pop();
                if (lastCard !== undefined) {
                    newCards.unshift(lastCard);
                }
                setCards(newCards);
            }, 700);
            setShift(true);
        }, 200);
    };

    useEffect(() => {
        const interval = setInterval(handleSwap, 3000);

        return () => clearInterval(interval);
    }, [cards, isAnimating, shift]);

    return (
        <div className={styles.stack} onClick={handleSwap}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${
                        isAnimating && index === cards.length - 1
                            ? styles.swap
                            : ""
                    } 
                    ${
                        shift && index === cards.length - 1
                            ? styles.moveDown
                            : ""
                    }
                    `}
                >
                    <img src={card} alt='' />
                </div>
            ))}
        </div>
    );
};

export default ThemeCards;
