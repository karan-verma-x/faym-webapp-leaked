import { brandsTextMap } from "../../../service/utils";
import styles from "./index.module.css";

interface props {
    image: string;
    title: string;
    mrp: number;
    sp: number;
    platform: string;
    rating: string;
    showProductTag: boolean;
    discountColor: string;
    url: string;
}

const Index: React.FC<props> = ({
    image,
    title,
    mrp,
    sp,
    platform,
    rating,
    showProductTag,
    discountColor,
    url,
}) => {
    return (
        <div
            className={styles.product}
            onClick={() => {
                window.open(url, "_blank");
            }}
        >
            {showProductTag ? (
                <div className={styles.prodcutTag}>
                    <img
                        className={styles.flashDealGif}
                        src='/assets/dealsPage/flash-deal.gif'
                        alt='Fire'
                    />
                    <div className={styles.flashDealText}>Flash Deal</div>
                </div>
            ) : (
                <></>
            )}
            <img className={styles.productImage} src={image} alt='Product' />
            <div className={styles.ratingContainer}>
                <div className={styles.ratingText}>{rating}</div>
                <img
                    className={styles.ratingIcon}
                    src='/assets/dealsPage/rating-star.png'
                    alt='Rating'
                />
            </div>
            <div className={styles.productTitle}>{title}</div>
            <div className={styles.productPriceContainer}>
                <div className={styles.productMrp}>₹{mrp}</div>
                <div className={styles.productSp}>₹{sp}</div>
                <div
                    className={styles.productDiscount}
                    style={discountColor ? { color: discountColor } : {}}
                >
                    {Math.floor(((mrp - sp) * 100) / mrp)}% OFF
                </div>
            </div>
            <img
                className={styles.productPlatform}
                src={brandsTextMap.get(platform)}
                alt='Platform'
            />
        </div>
    );
};

export default Index;
