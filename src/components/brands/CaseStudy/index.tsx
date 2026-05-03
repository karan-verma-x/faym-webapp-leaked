import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
    useState,
} from "react";
import { getAPIData } from "../../../service/utils";
import styles from "./index.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common.css";
import { signToken } from "../../../service/cypher";

const CaseStudy = () => {
    const [caseStudies, setCaseStudies] = useState<any>([]);
    const getCaseStudies = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/casestudies?page=brands",
                token: token,
            });
            if (response) {
                setCaseStudies(response.data.caseStudies);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCaseStudies();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        useCSS: true,
    };

    return (
        <div className={styles.container}>
            {window.innerWidth <= 500 ? (
                <>
                    <div className={styles.heading}>
                        Built to Turn Brands into
                        <div>Stories that Sell</div>
                    </div>
                    <div className={styles.description}>
                        Take a look at how Faym’s innovative
                        <div>stores are helping top brands</div>
                        <div>transform their sales by 5x.</div>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.heading}>
                        Built to{" "}
                        <span className={styles.highlight}>
                            Turn Brands into Stories
                        </span>{" "}
                        that Sell
                    </div>
                    <div className={styles.description}>
                        Take a look at how Faym’s innovative stores are helping
                        <br />
                        top brands transform their sales by 5x.
                    </div>
                </>
            )}

            <div className={styles.caseStudiesContainer}>
                {caseStudies.map(
                    (
                        e: {
                            color: any;
                            images: {
                                brandIcon: string | undefined;
                                backgroundImage: any;
                            };
                            description:
                                | string
                                | number
                                | boolean
                                | ReactElement<
                                      any,
                                      string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | null
                                | undefined;
                            brandName: any;
                            id: any;
                        },
                        i: Key | null | undefined
                    ) => {
                        return (
                            <div
                                className={styles.caseStudyItem}
                                style={{
                                    backgroundColor: `${e.color}`,
                                }}
                                key={i}
                            >
                                <div className={styles.content}>
                                    <img
                                        className={styles.brandImage}
                                        src={e.images.brandIcon}
                                    />
                                    <div
                                        className={styles.descriptionContainer}
                                    >
                                        <div
                                            className={styles.brandDescription}
                                        >
                                            {e.description}
                                        </div>
                                        <div
                                            onClick={() =>
                                                window.open(
                                                    `/casestudies/${e.brandName}/${e.id}`,
                                                    "_blank"
                                                )
                                            }
                                            className={styles.redirectContainer}
                                        >
                                            <div
                                                className={styles.redirectText}
                                            >
                                                Read story
                                            </div>
                                            <img
                                                src='assets/redirectIcon.svg'
                                                className={styles.redirectIcon}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.overlay}
                                    style={{
                                        backgroundImage: `url(${e.images.backgroundImage})`,
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                    }}
                                ></div>
                            </div>
                        );
                    }
                )}
            </div>
            <div className={styles.caseStudiesContainerMobile}>
                <Slider {...settings}>
                    {caseStudies.map(
                        (
                            e: {
                                images: {
                                    brandIcon: string | undefined;
                                    backgroundImage: any;
                                };
                                description:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                          any,
                                          string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined;
                                color: any;
                            },
                            i: Key | null | undefined
                        ) => {
                            return (
                                <div
                                    className={styles.caseStudyItemMobile}
                                    key={i}
                                >
                                    <div className={styles.contentMobile}>
                                        <img
                                            className={styles.brandImage}
                                            src={e.images.brandIcon}
                                        />
                                        <div
                                            className={
                                                styles.descriptionContainerMobile
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.brandDescription
                                                }
                                            >
                                                {e.description}
                                            </div>
                                            <div
                                                className={
                                                    styles.redirectContainer
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.redirectText
                                                    }
                                                >
                                                    Read story
                                                </div>
                                                <img
                                                    src='assets/redirectIcon.svg'
                                                    className={
                                                        styles.redirectIcon
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={styles.overlayMobile}
                                        style={{
                                            background: `url(${e.images.backgroundImage})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                        }}
                                    ></div>
                                    <div
                                        className={styles.overlayColorMobile}
                                        style={{
                                            backgroundColor: `${e.color}`,
                                        }}
                                    ></div>
                                </div>
                            );
                        }
                    )}
                </Slider>
            </div>
            <div className={styles.viewCaseStudiesButton}>
                <a href='/casestudies' target='_blank'>
                    View all Case Studies
                </a>
                <img src='/assets/redirectIcon.svg' />
                <div className={styles.slidingOverlay0}></div>
                <div className={styles.slidingOverlay1}></div>
            </div>
        </div>
    );
};
export default CaseStudy;
