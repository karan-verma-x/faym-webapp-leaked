import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { countryCode } from "../../../DataModels/countryCode";

interface DropDownProps {
    setCountryCode: (dialCode: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ setCountryCode }) => {
    const [dropDown, setDropDown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryCode[75]);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleDropDownToggle = () => {
        setDropDown(!dropDown);
    };

    const handleSelectCountry = (index: number) => {
        const selected = filteredCountries[index];
        const originalIndex = countryCode.findIndex(
            (country) =>
                country.name === selected.name &&
                country.phoneCode === selected.phoneCode
        );
        setSelectedCountry(countryCode[originalIndex]);
        setCountryCode(countryCode[originalIndex].phoneCode);
        setDropDown(false);
        setSearchQuery("");
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchBoxClick = (
        event: React.MouseEvent<HTMLInputElement>
    ) => {
        event.stopPropagation();
    };

    const filteredCountries = countryCode.filter((country) => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        return (
            country.name.toLowerCase().startsWith(normalizedQuery) ||
            country.phoneCode.includes(normalizedQuery)
        );
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropDown(false);
                setSearchQuery("");
            }
        };

        const handleWindowBlur = () => {
            setDropDown(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, []);

    return (
        <div className={styles.dropDownContainer}>
            <div className={styles.dropDown} ref={dropdownRef}>
                <div
                    className={styles.countryFlagAndArrow}
                    onClick={handleDropDownToggle}
                >
                    <div className={styles.flagIcon}>
                        <img
                            className={styles.flagIcon}
                            src={selectedCountry.image}
                            alt={selectedCountry.name}
                        />
                    </div>
                    <div>
                        <img
                            src={
                                dropDown
                                    ? "assets/dropdownArrowUp.png"
                                    : "assets/dropdownArrowDown.png"
                            }
                            style={{ width: "1.5em" }}
                            alt='dropdown'
                        />
                    </div>
                </div>

                <div
                    className={`${
                        dropDown
                            ? styles.dropDownContent
                            : styles.dropDownContentHide
                    }`}
                >
                    <div className={styles.searchBox}>
                        <input
                            type='text'
                            placeholder='Search'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onClick={handleSearchBoxClick}
                            className={styles.searchInput}
                        />
                    </div>
                    <div
                        className={styles.countryScroller}
                        style={{ height: "100%", overflow: "scroll" }}
                    >
                        {filteredCountries.map((country, index) => (
                            <div
                                key={index}
                                className={styles.countryItem}
                                onClick={() => handleSelectCountry(index)}
                            >
                                <img
                                    className={`${styles.flagIcon} ${styles.flagsBorder}`}
                                    src={country.image}
                                    alt={country.name}
                                />
                                <span>{country.name}</span>
                                <span>{country.phoneCode}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ width: "0.505em" }}></div>
        </div>
    );
};

export default DropDown;
