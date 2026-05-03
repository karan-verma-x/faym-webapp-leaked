import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import { useParams } from "react-router-dom";
import CaseStudyCard from "../CaseStudyCard";
import CaseStudyFilter from "../CaseStudyFilter";
import { CaseStudy, Filter } from "../../../DataModels/caseStudies";
import { signToken } from "../../../service/cypher";

const Index = () => {
    const [caseStudy, setCaseStudy] = useState<CaseStudy[]>([]);
    const [allCaseStudies, setAllCaseStudies] = useState<CaseStudy[]>([]);
    const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>(
        []
    );
    const [hideViewMoreBtn, setHideViewMoreBtn] = useState(false);
    const [filtersRow, setFilterRow] = useState<Filter[]>([]);
    const [filtersRow1, setFilterRow1] = useState<Filter[]>([]);
    const [filtersRow2, setFilterRow2] = useState<Filter[]>([]);
    const [selectedOption, setSelectedOption] = useState<String>("All");
    let { id } = useParams();

    const leftDivRef = useRef<HTMLDivElement | null>(null);
    const outerContainerRef = useRef<HTMLDivElement | null>(null);
    const [isFixed, setIsFixed] = useState(false);

    const socailMedia = [
        {
            name: "Instagram",
            link: "https://instagram.com/faym.co",
            icon: "/assets/Instagram.png",
        },
        {
            name: "Linkedin",
            link: "https://in.linkedin.com/company/getfaym",
            icon: "/assets/LinkedIn.png",
        },
    ];

    const getCaseAllStudies = async (limit: number) => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/website/casestudies?page=brandcasestudy&id=${id}&limit=${limit}&offset=${allCaseStudies.length}`,
                token: token,
            });

            if (response.data.caseStudies.length >= limit) {
                setHideViewMoreBtn(false);
            } else {
                setHideViewMoreBtn(true);
            }

            if (response.status === 200) {
                setFilterRow(response.data.caseStudyFilter);
                let ele = Math.floor(response.data.caseStudyFilter.length / 2);
                let i = 0;
                let j = ele;
                let filterSet1 = [];
                let filterSet2 = [];
                while (i < ele) {
                    filterSet1.push(response.data.caseStudyFilter[i]);
                    i += 1;
                }
                while (j !== response.data.caseStudyFilter.length) {
                    filterSet2.push(response.data.caseStudyFilter[j]);
                    j += 1;
                }
                setFilterRow1(filterSet1);
                setFilterRow2(filterSet2);
                setCaseStudy(
                    response.data.caseStudies.filter(
                        (ele: { id: string | undefined }) => {
                            return ele.id === id;
                        }
                    )
                );
                let resommendedCaseStudies = response.data.caseStudies.filter(
                    (ele: { id: string | undefined }) => {
                        return ele.id !== id;
                    }
                );
                setAllCaseStudies([
                    ...allCaseStudies,
                    ...resommendedCaseStudies,
                ]);
                setFilteredCaseStudies([
                    ...filteredCaseStudies,
                    ...resommendedCaseStudies,
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCaseAllStudies(6);
    }, []);

    useEffect(() => {
        const filteredCaseStudiesData =
            selectedOption === "All"
                ? allCaseStudies
                : allCaseStudies.filter(
                      (individualStudy: CaseStudy) =>
                          individualStudy.category?.toLowerCase() ===
                          selectedOption.toLowerCase()
                  );
        setFilteredCaseStudies(filteredCaseStudiesData);
    }, [selectedOption]);

    const handleScroll = () => {
        if (outerContainerRef.current) {
            const containerRect =
                outerContainerRef.current.getBoundingClientRect();
            if (containerRect.top <= 0) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.headingWrapper}>
                <h3>{caseStudy[0]?.description}</h3>
            </div>
            <div className={styles.midSection}>
                <div className={styles.leftColumn}>
                    <p>
                        {new Date(caseStudy[0]?.createdAt).toLocaleDateString(
                            "en-in",
                            { day: "numeric", month: "long", year: "numeric" }
                        )}
                    </p>
                    <div className={styles.socialMediaWrapper}>
                        {socailMedia.map((item, index) => {
                            return (
                                <a key={index} href={item.link} target='_blank'>
                                    <img
                                        src={item.icon}
                                        alt={item.name}
                                        loading='lazy'
                                    />
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <img
                        src={caseStudy[0]?.images.brandIconColor}
                        alt={caseStudy[0]?.brandName}
                        loading='lazy'
                    />
                    <h3>+</h3>
                    <img src='/assets/logo.png' alt='logo' loading='lazy' />
                </div>
            </div>
            <div className={styles.contentWrapper} ref={outerContainerRef}>
                <div className={styles.leftContainer}>
                    <div
                        className={`${styles.filterContainer} ${
                            isFixed && styles.fixed
                        }`}
                        ref={leftDivRef}
                    >
                        <p>CASE STUDIES</p>
                        {filtersRow?.map((option, index) => {
                            return (
                                <CaseStudyFilter
                                    key={index}
                                    option={option}
                                    setSelectedOption={setSelectedOption}
                                    selectedOption={selectedOption}
                                />
                            );
                        })}
                    </div>
                    <div className={styles.filterHue}></div>
                </div>

                <div className={styles.contentContainer}>
                    <div>
                        <h3>Objective</h3>
                        <p>{caseStudy[0]?.objective}</p>
                    </div>
                    <div>
                        <h3>Strategy</h3>
                        <p>{caseStudy[0]?.strategy}</p>
                    </div>
                    <div>
                        <h3>Milestones</h3>
                        <div className={styles.milestoneWrapper}>
                            {caseStudy[0]?.milestones?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={styles.milestoneContainer}
                                    >
                                        <h4>{item.stats}</h4>
                                        <p>{item.title}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <h3>Recommended Case Studies</h3>
                        <div className={styles.mobileLayout}>
                            <div className={styles.filterRow}>
                                {filtersRow1?.map((option, index) => {
                                    return (
                                        <CaseStudyFilter
                                            key={index}
                                            option={option}
                                            setSelectedOption={
                                                setSelectedOption
                                            }
                                            selectedOption={selectedOption}
                                        />
                                    );
                                })}
                            </div>
                            <div className={styles.filterRow}>
                                {filtersRow2?.map((option, index) => {
                                    return (
                                        <CaseStudyFilter
                                            key={index}
                                            option={option}
                                            setSelectedOption={
                                                setSelectedOption
                                            }
                                            selectedOption={selectedOption}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.caseStudiesCardSection}>
                            {filteredCaseStudies?.map((item, index) => {
                                return (
                                    <CaseStudyCard key={index} item={item} />
                                );
                            })}
                        </div>
                        {!hideViewMoreBtn && (
                            <div>
                                <button
                                    className={styles.viewMoreBtn}
                                    onClick={() => getCaseAllStudies(6)}
                                >
                                    View More
                                    <img
                                        src='/assets/redirectIcon.svg'
                                        loading='lazy'
                                        alt='arrow'
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
