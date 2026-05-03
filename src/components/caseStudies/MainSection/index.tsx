import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import TopSection from "../TopSection";
import CaseStudyFilter from "../CaseStudyFilter";
import CaseStudiesCard from "../CaseStudyCard";
import { CaseStudy, Filter } from "../../../DataModels/caseStudies";
import { signToken } from "../../../service/cypher";

const Index = () => {
    const [filters, setFilters] = useState<Filter[]>([]);
    const [filtersRow1, setFilterRow1] = useState<Filter[]>([]);
    const [filtersRow2, setFilterRow2] = useState<Filter[]>([]);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [selectedOption, setSelectedOption] = useState<String>("All");
    const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>(
        []
    );

    const filteredData = () => {
        const filteredCaseStudiesData =
            selectedOption === "All"
                ? caseStudies
                : caseStudies.filter(
                      (individualStudy: CaseStudy) =>
                          individualStudy.category?.toLowerCase() ===
                          selectedOption.toLowerCase()
                  );
        setFilteredCaseStudies(filteredCaseStudiesData);
    };

    useEffect(() => {
        filteredData();
    }, [selectedOption]);

    const getCaseStudy = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: `api/website/casestudies?page=casestudies`,
                token: token,
            });

            if (response.data) {
                setFilters(response.data.caseStudyFilter);
                setCaseStudies(response.data.caseStudies);
                setFilteredCaseStudies(response.data.caseStudies);

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
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCaseStudy();
    }, []);

    const outerContainerRef = useRef<HTMLDivElement | null>(null);
    const [isFixed, setIsFixed] = useState(false);

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
        <div className={styles.container}>
            <TopSection casestudies={caseStudies} />
            <div className={styles.mainContainer} ref={outerContainerRef}>
                <div className={styles.leftContainer}>
                    <div
                        className={`${styles.filterContainer} ${
                            isFixed && styles.fixed
                        }`}
                    >
                        <p>CASE STUDIES</p>
                        {filters?.map((option, index) => {
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
                    <div className={styles.header}>CASE STUDIES</div>
                    <div className={styles.mobile}>
                        <div className={styles.filterRow}>
                            {filtersRow1?.map((option, index) => {
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
                        <div className={styles.filterRow}>
                            {filtersRow2?.map((option, index) => {
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
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.rightContainer}>
                        {filteredCaseStudies?.map((item, index) => {
                            return <CaseStudiesCard key={index} item={item} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
