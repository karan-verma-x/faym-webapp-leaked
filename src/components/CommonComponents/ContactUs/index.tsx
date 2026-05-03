import styles from "./index.module.css";
import React, { useEffect, useState, useRef } from "react";
import { postAPI } from "../../../service/utils";
import ReactGA from "react-ga4";
import mixpanel from "mixpanel-browser";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import DropDown from "../dropdown";

const ContactUs = () => {
    const location = useLocation();
    const getQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const params: { [key: string]: string } = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    };

    const referral = window.location.search;
    const [contactInfo, setContactInfo] = useState({
        name: "",
        companyName: "",
        email: "",
        message: "",
        phoneNumber: "",
        socialMedia: "",
        userName: "",
    });
    const [countryDialCode, setCountryDialCode] = useState("+91");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [socialIndex, setSocialIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const phoneSchema = yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid");
    const emailSchema = yup.string().email("Email is not valid");
    const dropDownList = [
        {
            icon: "assets/igDropdownItem.png",
            label: "Instagram Username*",
            socialMedia: "Instagram",
        },
        {
            icon: "assets/ytDropdownItem.png",
            label: "Youtube Username*",
            socialMedia: "Youtube",
        },
        {
            icon: "assets/liDropdownItem.png",
            label: "Linkedin Username*",
            socialMedia: "Linkedin",
        },
    ];
    let subheading: String;
    let page: String;

    switch (location.pathname) {
        case "/":
            page = "Brands";
            subheading =
                "Ready to chat? Explore tailored brand strategy on a 1:1 call with our experts.";
            break;
        case "/creators":
            page = "Creators";
            subheading =
                "Take a look at how Faym’s innovative stores are helping creators transform their sales by 5x.";
            break;
        default:
            page = "";
            subheading =
                "Ready to chat? Explore tailored brand strategy on a 1:1 call with our experts.";
    }

    const setAnimation = (
        label: HTMLElement | null,
        input: HTMLElement | null | undefined
    ) => {
        input?.focus();
        if (label) {
            label.style.top = "0px";
            label.style.transition = "all 0.2s ease-in-out";
        }
    };

    const removeAnimation = (
        label: HTMLElement | null,
        input: HTMLElement | null | undefined
    ) => {
        input?.blur();
        if (label) {
            label.style.top = "20px";
            label.style.transition = "all 0.2s ease-in-out";
        }
    };

    const onFocusName = () => {
        let wrapper = document.getElementById("wrapper-1");
        let label = document.getElementById("nameLabel");
        let input = document.getElementById("nameInput");
        if (wrapper) {
            setAnimation(label, input);
        }
    };

    const onBlurName = () => {
        let wrapper = document.getElementById("wrapper-1");
        let label = document.getElementById("nameLabel");
        let input = document.getElementById("nameInput");
        if (wrapper && contactInfo.name === "") {
            removeAnimation(label, input);
        }
    };

    const onFocusCompany = () => {
        let wrapper = document.getElementById("wrapper-2");
        let label = document.getElementById("companyLabel");
        let input = document.getElementById("companyInput");
        if (wrapper) {
            setAnimation(label, input);
        }
    };

    const onBlurCompany = () => {
        let wrapper = document.getElementById("wrapper-2");
        let label = document.getElementById("companyLabel");
        let input = document.getElementById("companyInput");
        if (page === "Creators") {
            if (wrapper && contactInfo.userName === "") {
                removeAnimation(label, input);
            }
        } else {
            if (wrapper && contactInfo.companyName === "") {
                removeAnimation(label, input);
            }
        }
    };

    const onFocusEmail = () => {
        let wrapper = document.getElementById("wrapper-3");
        let label = document.getElementById("emailLabel");
        let input = document.getElementById("emailInput");
        if (wrapper) {
            setAnimation(label, input);
        }
    };

    const onBlurEmail = () => {
        let wrapper = document.getElementById("wrapper-3");
        let label = document.getElementById("emailLabel");
        let input = document.getElementById("emailInput");
        if (wrapper && contactInfo.email === "") {
            removeAnimation(label, input);
        }
    };

    const onFocusPhone = () => {
        let wrapper = document.getElementById("wrapper-4");
        let label = document.getElementById("phoneLabel");
        let input = document.getElementById("phoneInput");
        if (wrapper) {
            setAnimation(label, input);
        }
    };

    const onBlurPhone = () => {
        let wrapper = document.getElementById("wrapper-4");
        let label = document.getElementById("phoneLabel");
        let input = document.getElementById("phoneInput");
        if (wrapper && contactInfo.phoneNumber === "") {
            removeAnimation(label, input);
        }
    };

    const handelDropDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        setDropDown((down) => !down);
    };
    const handelChange = (e: { target: { name: any; value: any } }) => {
        setEmailError('')
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const saveData = async (data: any) => {
        const queryParams = getQueryParams();
        data.leadsInfo = queryParams;
        try {
            setLoading(true);
            const response = await postAPI(
                `api/website/contact?page=${page}`,
                data
            );
            if (response.status === 200) {
                ReactGA.event({
                    category: `${page}`,
                    action: "Submitted Contact Us Form",
                    label: location + " | " + referral.split("=")[1],
                });
                mixpanel.track("contact us", {
                    category: `${page}`,
                    action: "form submitted",
                });
                setSent(true);
                setContactInfo({
                    name: "",
                    companyName: "",
                    email: "",
                    message: "",
                    phoneNumber: "",
                    socialMedia: "",
                    userName: "",
                });
                setTimeout(() => {
                    setSent(false);
                }, 1000 * 3);
            }
        } catch (error) {
            setSent(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handelSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const email = contactInfo.email;
        if (contactInfo.phoneNumber.length < 10) {
            setError("Please entre a valid phone number!");
            return;
        }
        phoneSchema
            .validate(contactInfo.phoneNumber)
            .then((validPhone) => {
                console.log("Phone number is valid");
            })
            .catch((error) => {
                console.error("Phone number validation error:", error.errors);
                setError("Please entre a valid phone number!");
                return;
            });
        emailSchema
            .validate(contactInfo.email)
            .then((validEmail) => {
                console.log("Email is valid:");
            })
            .catch((error) => {
                setError("Please enter a valid email!");
                console.error("Email validation error:", error.errors);
                return;
            });

        if (page === "Creators") {
            const data = {
                name: contactInfo.name,
                email: contactInfo.email,
                message: contactInfo.message,
                phoneNumber: countryDialCode + contactInfo.phoneNumber,
                creatorInfo: {
                    socialMedia:
                        contactInfo.socialMedia !== ""
                            ? contactInfo.socialMedia
                            : dropDownList[0].socialMedia,
                    userName: contactInfo.userName,
                },
            };
            saveData(data);
        } else if (page === "Brands") {
            if (
                /^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|yahoo)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/.test(
                    email
                )
            ) {
                const data = {
                    name: contactInfo.name,
                    companyName: contactInfo.companyName,
                    email: contactInfo.email,
                    message: contactInfo.message,
                    phoneNumber: countryDialCode + contactInfo.phoneNumber,
                };
                saveData(data);
            } else {
                setError("Please enter a valid work email!");
            }
        }
    };

    useEffect(() => {
        let timer: any;
        if (error) {
            timer = setTimeout(() => {
                setError("");
            }, 4000);
        }
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropDown(false);
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
        <div
            className={styles.brandsContainer}
            id='contactus'
            data-theme='dark'
        >
            <h4
                className={`${styles.heading2} ${
                    page === "Brands" ? styles.gradient : ""
                }`}
            >
                Let's Get You Started!
            </h4>
            <p className={styles.heading3}>{subheading}</p>
            <div className={styles.container}>
                <div className={styles.contactInfo}>
                    <div className={styles.info}>
                        <h2>Contact Information</h2>
                        <div className={styles.contact}>
                            <img src='/assets/mail.png' alt='email' />
                            <a href='mailto:support@faym.co'>support@faym.co</a>
                        </div>
                        <div className={styles.contact}>
                            <img src='/assets/call.png' alt='phone' />
                            {page !== "Brands" ? (
                                <a href='tel:+91 83683 93419'>
                                    +91 83683 93419
                                </a>
                            ) : (
                                <a href='tel:+91 74538 46168'>
                                    +91 74538 46168
                                </a>
                            )}
                        </div>
                        <div className={styles.contact}>
                            <img src='/assets/location.png' alt='location' />
                            <p
                                onClick={() => {
                                    window.open(
                                        "https://maps.app.goo.gl/x7QWsc9AK7oS6Evx8",
                                        "_blank"
                                    );
                                }}
                            >
                                46 - IP, Sector 42, Golf Course Road, Gurgaon,
                                DLF PHASE IV,<br/> Haryana - 122009, India
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.contactFormWrapper}>
                    <form
                        className={styles.contactForm}
                        onSubmit={handelSubmit}
                    >
                        <div className={`${styles.row} ${styles.row1}`}>
                            <div
                                onFocus={onFocusName}
                                onBlur={onBlurName}
                                className={styles.wrapper}
                                id='wrapper-1'
                            >
                                <label id='nameLabel' onClick={onFocusName}>
                                    Name*
                                </label>
                                <input
                                    id='nameInput'
                                    onChange={handelChange}
                                    name='name'
                                    value={contactInfo.name}
                                    type='text'
                                    autoComplete='off'
                                    required
                                    pattern='^[A-Z a-z]+$'
                                />
                                <div className={styles.underline}></div>
                            </div>
                            <div
                                onFocus={onFocusCompany}
                                onBlur={onBlurCompany}
                                id='wrapper-2'
                                className={`${styles.wrapper} ${styles.mobilePosition}`}
                                style={
                                    window.innerWidth < 768
                                        ? {
                                              position: "absolute",
                                              top: "300%",
                                              width: "97%",
                                          }
                                        : {}
                                }
                            >
                                {page !== "Brands" ? (
                                    <>
                                        <div
                                            className={styles.dropDownInputs}
                                            ref={dropdownRef}
                                        >
                                            <div
                                                className={styles.dropdown}
                                                onClick={handelDropDown}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                    }}
                                                >
                                                    <div
                                                        className={
                                                            styles.socialIcon
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles.socialIcon
                                                            }
                                                            src={
                                                                dropDownList[
                                                                    socialIndex
                                                                ].icon
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        onClick={handelDropDown}
                                                    >
                                                        <img
                                                            src='assets/dropdownArrowDown.png'
                                                            style={{
                                                                width: "1.5em",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className={`${
                                                        dropDown
                                                            ? styles.dropdownContent
                                                            : styles.dropdownContentHide
                                                    }`}
                                                >
                                                    {dropDownList.map(
                                                        (e, i) => {
                                                            return (
                                                                <>
                                                                    {i === 0 ? (
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                            }}
                                                                        >
                                                                            <img
                                                                                className={
                                                                                    styles.socialIcon
                                                                                }
                                                                                src={
                                                                                    e.icon
                                                                                }
                                                                                onClick={() => {
                                                                                    setSocialIndex(
                                                                                        i
                                                                                    );
                                                                                    setContactInfo(
                                                                                        {
                                                                                            ...contactInfo,
                                                                                            ["socialMedia"]:
                                                                                                dropDownList[
                                                                                                    i
                                                                                                ]
                                                                                                    .socialMedia,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <img
                                                                                src='assets/dropdownArrowUp.png'
                                                                                className={
                                                                                    styles.dropDownArrow
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <img
                                                                            className={
                                                                                styles.socialIcon
                                                                            }
                                                                            src={
                                                                                e.icon
                                                                            }
                                                                            onClick={() => {
                                                                                setSocialIndex(
                                                                                    i
                                                                                );
                                                                                setContactInfo(
                                                                                    {
                                                                                        ...contactInfo,
                                                                                        ["socialMedia"]:
                                                                                            dropDownList[
                                                                                                i
                                                                                            ]
                                                                                                .socialMedia,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                </>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                style={{ width: "0.625em" }}
                                            ></div>
                                            <div>
                                                <label
                                                    id='companyLabel'
                                                    onClick={onFocusCompany}
                                                >
                                                    {
                                                        dropDownList[
                                                            socialIndex
                                                        ].label
                                                    }
                                                </label>
                                                <input
                                                    id='companyInput'
                                                    onChange={handelChange}
                                                    name='userName'
                                                    value={contactInfo.userName}
                                                    type='text'
                                                    autoComplete='off'
                                                    required
                                                />
                                                <div
                                                    className={styles.underline}
                                                    style={
                                                        window.innerWidth < 768
                                                            ? {
                                                                  width: "96.5%",
                                                              }
                                                            : {}
                                                    }
                                                ></div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            id='companyLabel'
                                            onClick={onFocusCompany}
                                        >
                                            Company Name*
                                        </label>
                                        <input
                                            id='companyInput'
                                            onChange={handelChange}
                                            name='companyName'
                                            value={contactInfo.companyName}
                                            type='text'
                                            autoComplete='off'
                                            required
                                        />

                                        <div className={styles.underline}></div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`${styles.row} ${styles.row2}`}>
                            <div
                                onFocus={onFocusEmail}
                                onBlur={onBlurEmail}
                                id='wrapper-3'
                                className={`${styles.wrapper}`}
                            >
                                <label id='emailLabel' onClick={onFocusEmail}>
                                    Email ID {page !== "Brands" ? "" : "*"}
                                </label>
                                <input
                                    id='emailInput'
                                    onChange={handelChange}
                                    name='email'
                                    value={contactInfo.email}
                                    type='email'
                                    autoComplete='off'
                                    required={page === "Brands"}
                                />

                                <div className={styles.underline}></div>
                            </div>
                            <div id='wrapper-4' className={styles.wrapper}>
                                <div>
                                    <div className={styles.dropDownInputs}>
                                        <DropDown
                                            setCountryCode={setCountryDialCode}
                                        />
                                        <div
                                            onFocus={onFocusPhone}
                                            onBlur={onBlurPhone}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "100%",
                                            }}
                                        >
                                            <label
                                                id='phoneLabel'
                                                onClick={onFocusPhone}
                                                className={styles.phoneLabel}
                                            >
                                                Phone Number*
                                            </label>
                                            <input
                                                id='phoneInput'
                                                onChange={handelChange}
                                                name='phoneNumber'
                                                value={contactInfo.phoneNumber}
                                                type='tel'
                                                autoComplete='off'
                                                required
                                                pattern='[0-9]{10}'
                                                minLength={10}
                                                maxLength={10}
                                            />
                                            <div
                                                className={`${styles.underline}`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.row} ${styles.row3}`}>
                            <div className={styles.wrapper}>
                                <label>Your Message*</label>
                                <textarea
                                    onChange={handelChange}
                                    name='message'
                                    value={contactInfo.message}
                                    rows={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className={`${styles.row} ${styles.row4}`}>
                            <button
                                type='submit'
                                disabled={loading ? true : false}
                                className={`${styles.sendButton} ${
                                    !loading && styles.btnEnabled
                                }`}
                                style={{
                                    color: "white",
                                    backgroundColor: sent
                                        ? "#000000"
                                        : "#e63238",
                                }}
                            >
                                {sent ? "Message Sent" : "Send Message"}
                                {loading ? (
                                    <div className={styles.loader}></div>
                                ) : (
                                    <img
                                        src={
                                            sent
                                                ? "/assets/white_tick.png"
                                                : "/assets/redirectIcon.svg"
                                        }
                                        alt='arrow'
                                    />
                                )}
                                <div className={styles.slidingOverlay0}></div>
                                <div className={styles.slidingOverlay1}></div>
                            </button>
                        </div>
                    </form>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
