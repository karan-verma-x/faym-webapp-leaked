import styles from "./index.module.css";
import SmallProductTemplate from "./../../components/smallProductCard";
import { signToken } from "../../../service/cypher";
import { getAPIData } from "../../../service/utils";
import { Product } from "../../../DataModels/products";
import { useEffect, useState } from "react";

interface props {
    title: string;
    gender: string;
    products: Product[];
}

const Index: React.FC<props> = ({ title, gender, products }) => {
    // const [products, setProducts] = useState<Product[]>([]);
    // const getSectionProducts = async (_gender: string, _title: string) => {
    //     try {
    //         let token = await signToken();
    //         const response = await getAPIData({
    //             url: `api/deals/best-deals?gender=${_gender}&section=${_title}`,
    //             token: token,
    //         });
    //         const updatedProducts = response.data.data.products.map(
    //             (product: Product) => ({
    //                 ...product,
    //                 showProductTag: false,
    //                 discountColor: "#FC5613",
    //             })
    //         );
    //         setProducts(updatedProducts);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     getSectionProducts(gender, title);
    // }, [gender]);

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.headerText1}>₹</div>
                <div className={`${styles.headerText1} ${styles.headerText2}`}>
                    {title.split(" ")[0]} Store
                </div>
            </div>
            <div className={styles.description}>
                <div className={styles.descriptionText1}>
                    Deals refresh daily at:{" "}
                </div>
                <div
                    className={`${styles.descriptionText1} ${styles.descriptionText2}`}
                >
                    9AM | 1PM | 6PM
                </div>
            </div>
            <div className={styles.productsContainer}>
                <div
                    className={styles.productsContainerRowsWrapper}
                    style={
                        products.length <= 4 ? { justifyContent: "center" } : {}
                    }
                >
                    {products.map((e, i) => {
                        if (i % 2 !== 0) return null;
                        return (
                            <div key={i}>
                                <SmallProductTemplate
                                    image={products[i].image}
                                    title={products[i].title}
                                    mrp={products[i].price.actualPrice}
                                    sp={products[i].price.discountedPrice}
                                    platform={products[i].partnerName}
                                    rating={products[i].rating}
                                    showProductTag={products[i].showProductTag}
                                    discountColor={products[i].discountColor}
                                    url={products[i].shortLink}
                                />
                                <div
                                    className={styles.productRowSaperator}
                                ></div>
                                {products[i + 1] && (
                                    <SmallProductTemplate
                                        image={products[i+1].image}
                                        title={products[i+1].title}
                                        mrp={products[i+1].price.actualPrice}
                                        sp={products[i+1].price.discountedPrice}
                                        platform={products[i+1].partnerName}
                                        rating={products[i+1].rating}
                                        showProductTag={
                                            products[i+1].showProductTag
                                        }
                                        discountColor={
                                            products[i+1].discountColor
                                        }
                                        url={products[i+1].shortLink}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div className={styles.productRowEndSpacer}></div>
                </div>
            </div>
        </div>
    );
};

export default Index;
