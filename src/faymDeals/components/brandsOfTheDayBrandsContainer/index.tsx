import styles from "./index.module.css";

interface props {
    brandIcon: string;
    brandName: string;
    discount: string;
    index: number;
    selectedBrand: number | null;
    onClick: (brandName: string, index: number) => void;
}

const Index: React.FC<props> = ({
    brandIcon,
    brandName,
    discount,
    index,
    selectedBrand,
    onClick,
}) => {
    return (
        <div
            className={styles.brandContainer}
            onClick={() => onClick(brandName, index)}
        >
            <div
                className={`${styles.discount} ${
                    selectedBrand === index ? styles.selectedBrandDiscount : ""
                }`}
            >
                {discount}
            </div>
            <div
                className={`${styles.brandIconContainer} ${
                    selectedBrand === index
                        ? styles.selectedBrandIconContainer
                        : ""
                }`}
            >
                <img className={styles.brandIcon} src={brandIcon} alt='icon' />
            </div>
        </div>
    );
};

export default Index;
