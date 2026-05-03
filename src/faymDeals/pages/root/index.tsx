import styles from "./index.module.css";
import "./../../../global.css";
import SellingOutFast from "./../../sections/sellingOutFast";
import BrandsOfTheDay from "./../../sections/brandsOfTheDay";
import LockedNowLiveTomorrow from "./../../sections/lockedNowLiveTomorrow";
import DiscountedStore from "./../../sections/discountedStore";
import StoreSaperators from "./../../sections/storesSaperator";
import PricedStore from "./../../sections/pricedStore";
import HeroSection from "./../../sections/heroSection";
import FooterSection from "./../../sections/footerSection";
import { getAPIData } from "../../../service/utils";
import { useEffect, useState } from "react";
import { signToken } from "../../../service/cypher";
import { Product } from "../../../DataModels/products";
import { BrandDeal } from "../../../DataModels/dealsBrands";
import { Section } from "../../../DataModels/section";
import mixpanel from "mixpanel-browser";

const Index = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [maleBrands, setMaleBrands] = useState<BrandDeal[]>([]);
    const [femaleBrands, setFemaleBrands] = useState<BrandDeal[]>([]);
    const [gender, setGender] = useState("female");
    const [maleFlashDealsProducts, setMaleFlashDealsProducts] = useState<
        Product[]
    >([]);
    const [femaleFlashDealsProducts, setFemaleFlashDealsProducts] = useState<
        Product[]
    >([]);
    const [percentProducts, setPercentProducts] = useState<Product[]>([]);
    const [lesserPriceProducts, setLesserPriceProducts] = useState<Product[]>(
        []
    );
    const [higherPriceProducts, setHigherPriceProducts] = useState<Product[]>(
        []
    );

    const getSections = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/deals/sections",
                token: token,
            });
            if (response) {
                setSections(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getFlashDealsProducts = async (_gender: any) => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/deals/flash-deals?gender=${_gender}`,
                token: token,
            });
            if (_gender === "female") {
                setFemaleFlashDealsProducts(response.data.data.products);
            } else if (_gender === "male") {
                setMaleFlashDealsProducts(response.data.data.products);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAllBrands = async (_gender: any) => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/deals/brands?gender=${_gender}`,
                token: token,
            });
            if (_gender === "female") {
                setFemaleBrands(response.data.data.brands);
            } else if (_gender === "male") {
                setMaleBrands(response.data.data.brands);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getSectionProducts = async (
        _gender: string,
        _title: string,
        setProducts: (products: Product[]) => void,
        _showProductTag: boolean,
        _color: string
    ) => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/deals/best-deals?gender=${_gender}&section=${_title}`,
                token: token,
            });
            const updatedProducts = response.data.data.products.map(
                (product: Product) => ({
                    ...product,
                    showProductTag: _showProductTag,
                    discountColor: _color,
                })
            );
            setProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSections();
        getFlashDealsProducts(gender);
        getAllBrands(gender);
        getSectionProducts(
            gender,
            "upto 80%",
            setPercentProducts,
            false,
            "#FC5613"
        );
        getSectionProducts(
            gender,
            "199 store",
            setLesserPriceProducts,
            false,
            "#FC5613"
        );
        getSectionProducts(
            gender,
            "499 store",
            setHigherPriceProducts,
            false,
            "#FC5613"
        );
    }, [gender]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paramObj: Record<string, string> = {};
        let index = 1;

        params.forEach((value) => {
            paramObj[`param${index}`] = value;
            index += 1;
        });

        mixpanel.track("LOADED DEALS PAGE", {
            category: "DEALS",
            action: "Opened Deals Page",
            ...paramObj, // spread dynamic params
        });
    }, []);

    return (
        <div className={styles.page}>
            <HeroSection />
            <div style={{ height: "30px" }}></div>
            <SellingOutFast
                title='selling out fast'
                selectedGender={gender}
                setSelectedGender={setGender}
                products={
                    gender === "male"
                        ? maleFlashDealsProducts
                        : gender === "female"
                        ? femaleFlashDealsProducts
                        : []
                }
            />
            <div style={{ height: "30px" }}></div>
            {(gender === "male" && maleBrands.length > 0) ||
            (gender === "female" && femaleBrands.length > 0) ? (
                <>
                    <BrandsOfTheDay
                        title='brand of the day'
                        brands={
                            gender === "male"
                                ? maleBrands
                                : gender === "female"
                                ? femaleBrands
                                : []
                        }
                        gender={gender}
                    />
                    <div style={{ height: "40px" }}></div>
                </>
            ) : (
                <></>
            )}

            {/* <LockedNowLiveTomorrow />
            <div style={{ height: "96px" }}></div> */}
            {percentProducts.length > 0 ? (
                <>
                    <DiscountedStore
                        title='upto 80%'
                        gender={gender}
                        products={percentProducts}
                    />
                    <div style={{ height: "25.82px" }}></div>
                </>
            ) : (
                <></>
            )}
            <StoreSaperators />
            {lesserPriceProducts.length > 0 ? (
                <>
                    <PricedStore
                        title='199 store'
                        gender={gender}
                        products={lesserPriceProducts}
                    />
                    <div style={{ height: "50px" }}></div>
                </>
            ) : (
                <></>
            )}
            {higherPriceProducts.length > 0 ? (
                <>
                    <PricedStore
                        title='499 store'
                        gender={gender}
                        products={higherPriceProducts}
                    />
                    <div style={{ height: "50px" }}></div>
                </>
            ) : (
                <></>
            )}
            <FooterSection />
            <div style={{ height: "50px" }}></div>
        </div>
    );
};

export default Index;
