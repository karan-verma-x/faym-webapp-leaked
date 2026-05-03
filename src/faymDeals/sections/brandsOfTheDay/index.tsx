import styles from "./index.module.css";
import BrandsContainer from "./../../components/brandsOfTheDayBrandsContainer";
import SmallProductTemplate from "./../../components/smallProductCard";
import { useEffect, useState } from "react";
import { BrandDeal } from "../../../DataModels/dealsBrands";
import { Product } from "../../../DataModels/products";
import { signToken } from "../../../service/cypher";
import { getAPIData } from "../../../service/utils";

interface props {
    title: string | null;
    brands: Array<BrandDeal>;
    gender: string;
}

const Index: React.FC<props> = ({ title, brands, gender }) => {
    const [selectedBrand, setSelectedBrand] = useState<number>(0);
    const [brandProducts, setBrandProducts] = useState<Product[]>([]);

    const getBrandProducts = async (_gender: string, brand: string) => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/deals/day-brand?gender=${_gender}&brand=${brand}`,
                token: token,
            });

            const updatedProducts = response.data.data.products.map(
                (product: Product) => ({
                    ...product,
                    showProductTag: false,
                    discountColor: "#CB2F00",
                })
            );

            setBrandProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBrandClick = (brandName: string, index: number) => {
        setSelectedBrand(index);
        getBrandProducts(gender, brandName);
    };

    useEffect(() => {
        if (brands[selectedBrand]?.brandName)
            getBrandProducts(gender, brands[selectedBrand].brandName);
    }, [gender, brands]);

    return (
        <div className={styles.container}>
            <img
                className={styles.liveDealsGif}
                src='/assets/dealsPage/live-deals.gif'
                alt='Live Deals'
            />
            <img
                className={styles.brandsOfTheDayImage}
                src='/assets/dealsPage/brands-of-the-day.png'
                alt='Brands Of The Day'
            />
            <div className={styles.sectionMainContainer}>
                <div className={styles.brandsContainer}>
                    {brands.map((e, i) => (
                        <BrandsContainer
                            key={i}
                            brandIcon={e.brandImageIcon}
                            brandName={e.brandName}
                            discount={e.tag}
                            index={i}
                            selectedBrand={selectedBrand}
                            onClick={handleBrandClick}
                        />
                    ))}
                </div>
                <div className={styles.productsContainer}>
                    <div
                        className={styles.productsContainerRowsWrapper}
                        style={
                            brandProducts.length <= 4
                                ? {
                                      justifyContent: "center",
                                      paddingLeft: "0px ",
                                  }
                                : {}
                        }
                    >
                        {brandProducts.map((e: Product, i) => {
                            if (i % 2 !== 0) return null;
                            return (
                                <div key={i}>
                                    <SmallProductTemplate
                                        image={brandProducts[i].image}
                                        title={brandProducts[i].title}
                                        mrp={brandProducts[i].price.actualPrice}
                                        sp={
                                            brandProducts[i].price
                                                .discountedPrice
                                        }
                                        platform={brandProducts[i].partnerName}
                                        rating={brandProducts[i].rating}
                                        showProductTag={
                                            brandProducts[i].showProductTag
                                        }
                                        discountColor={
                                            brandProducts[i].discountColor
                                        }
                                        url={brandProducts[i].shortLink}
                                    />
                                    <div
                                        className={styles.productRowSaperator}
                                    ></div>
                                    {brandProducts[i + 1] && (
                                        <SmallProductTemplate
                                            image={brandProducts[i+1].image}
                                            title={brandProducts[i+1].title}
                                            mrp={
                                                brandProducts[i+1].price
                                                    .actualPrice
                                            }
                                            sp={
                                                brandProducts[i+1].price
                                                    .discountedPrice
                                            }
                                            platform={
                                                brandProducts[i+1].partnerName
                                            }
                                            rating={brandProducts[i+1].rating}
                                            showProductTag={
                                                brandProducts[i+1].showProductTag
                                            }
                                            discountColor={
                                                brandProducts[i+1].discountColor
                                            }
                                            url={brandProducts[i+1].shortLink}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {brandProducts.length <= 4 ? (
                            <></>
                        ) : (
                            <div className={styles.productRowSaperator}></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
