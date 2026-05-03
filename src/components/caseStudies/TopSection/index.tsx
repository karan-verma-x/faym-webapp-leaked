import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { CaseStudy } from "../../../DataModels/caseStudies";

interface topSectionProps {
    casestudies: CaseStudy[];
}
const TopSection: React.FC<topSectionProps> = ({ casestudies }) => {
    const brandNamesToFind: String[] = ["Meesho", "Tira Beauty", "Wild Craft"];
    const filteredItems = casestudies.filter((item) =>
        brandNamesToFind.includes(item.brandName)
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % filteredItems.length
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentIndex,filteredItems.length]);

    return (
        <div className={styles.container}>
            {filteredItems.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={`${styles.modal} ${
                            index !== currentIndex
                                ? styles.closing
                                : styles.opening
                        }`}
                        style={{
                            display: index !== currentIndex ? "none" : "flex",
                        }}
                    >
                        <div className={styles.heading}>
                            <h4>{item?.brandName.toUpperCase()} CASE STUDY</h4>
                            <p>{item?.description}</p>
                            <div
                                className={styles.viewButton}
                                onClick={() =>
                                    window.open(
                                        `/casestudies/${item.brandName}/${item.id}`,
                                        "_blank"
                                    )
                                }
                            >
                                <div>View case study {"  "}</div>
                                <img
                                    src='/assets/redirectIcon.svg'
                                    alt='arrow'
                                    className={styles.redirectIcon}
                                    loading='lazy'
                                />
                            </div>
                        </div>
                        <div className={styles.creatorImg}>
                            {item.images.brandTag && (
                                <img
                                    src={item.images.brandTag}
                                    alt='Brand Tag'
                                    className={styles.brandTag}
                                />
                            )}

                            <img
                                src={item?.images.mainBanner}
                                alt='creator Img'
                                className={styles.mainBanner}
                            />
                        </div>
                    </div>
                );
            })}

            <div className={styles.brandLogos}>
                {filteredItems.map((brand, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.logosBox}
                            onClick={() => {
                                setCurrentIndex(index);
                            }}
                        >
                            <div
                                className={styles.progressBar}
                                style={{
                                    display:
                                        index !== currentIndex ? "none" : "",
                                }}
                            >
                                <div className={styles.progress}></div>
                            </div>
                            <img
                                src={brand.images.brandIcon}
                                alt='brand icon'
                                className={styles.logo}
                                style={{
                                    opacity:
                                        index !== currentIndex ? "0.2" : "1",
                                    cursor:
                                        index !== currentIndex ? "pointer" : "",
                                    marginTop:
                                        index !== currentIndex ? "3px" : "",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopSection;