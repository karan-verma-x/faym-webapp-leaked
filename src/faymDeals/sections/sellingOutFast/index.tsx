import styles from "./index.module.css";
import BigProductTempalte from "./../../components/bigProductCard";
import { Product } from "../../../DataModels/products";

interface props {
    title: string | null
    selectedGender: string | null;
    setSelectedGender: (gender: string) => void;
    products: Array<Product>;
}

const Index: React.FC<props> = ({
    title,
    selectedGender,
    setSelectedGender,
    products,
}) => {
    return (
        <div className={styles.sellingOutFast}>
            <div className={styles.options}>
                <div
                    className={
                        selectedGender === "female"
                            ? styles.selectedWomenOption
                            : styles.option
                    }
                    onClick={() => {
                        setSelectedGender("female");
                    }}
                >
                    Women
                </div>
                <div
                    className={
                        selectedGender === "male"
                            ? styles.selectedMenOption
                            : styles.option
                    }
                    onClick={() => {
                        setSelectedGender("male");
                    }}
                >
                    Men
                </div>
            </div>
            <div
                className={
                    selectedGender === "female"
                        ? styles.backgroundWomen
                        : styles.backgroundMen
                }
            >
                <div className={styles.header}>Selling Out Fast</div>
                <div className={styles.productsRow}>
                    {products.length > 0 ? (
                        products?.map((e, i) => (
                            <BigProductTempalte
                                image={e.image}
                                title={e.title}
                                mrp={e.price.actualPrice}
                                sp={e.price.discountedPrice}
                                platform={e.partnerName}
                                rating={String(e.rating)}
                                url={products[i].shortLink}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
