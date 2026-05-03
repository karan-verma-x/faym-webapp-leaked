import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import ReactGA from "react-ga4";
import mixpanel from "mixpanel-browser";
import { postAPI } from "../../../service/utils";
import { message } from "antd";
import { useLocation } from "react-router-dom";

const Index = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupTriggered, setPopupTriggered] = useState(false);

    const referral = window.location.search;
    const location = useLocation();
    const [formValues, setFormValues] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        let error = "";

        if (!formValues.fullName.trim() ) {
            error = "Full Name is required.";
            isValid = false;
        }

        if (!formValues.mobileNumber.trim()) {
            error = "Mobile Number is required.";
            isValid = false;
        } else if (!/^\d{10}$/.test(formValues.mobileNumber)) {
            error= "Mobile Number must be 10 digits.";
            isValid = false;
        }

        if (!formValues.email.trim()) {
            error= "Email Address is required.";
            isValid = false;
        } else if (
            !/^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|yahoo)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/.test(
                formValues.email
            )
        ) {
            error = "Enter a valid work Email Address.";
            isValid = false;
        }
        if(!isValid){
             message.error({
                 content: error,
                 style: {
                     zIndex: 1000,
                 },
             });
        }
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            console.log("Form Submitted:", formValues);
            const data = {
                name: formValues.fullName,
                companyName: "used PopUp Form",
                email: formValues.email,
                message: "Submitted using PopUp Form",
                phoneNumber: "+91" + formValues.mobileNumber,
            };
            postAPI(`api/website/contact?page=Brands`, data)
                .then((response) => {
                    if (response.status === 200) {
                        ReactGA.event({
                            category: "Brands",
                            action: "Submitted Popup Us Form",
                            label: location + " | " + referral.split("=")[1],
                        });
                        mixpanel.track("contact us", {
                            category: "Brands",
                            action: "Popup form submitted",
                        });
                        message.success("Form submitted successfully");

                        // Close the popup after a short delay
                        setTimeout(() => {
                            setShowPopup(false);
                        }, 1000);
                    } else {
                        const errorMessage =
                            response.data?.message ||
                            "Unable to process your request. Please try again later.";
                        console.warn(
                            `Unexpected response: ${response.status}`,
                            response.data
                        );
                        message.error({
                            content: errorMessage,
                            style: { zIndex: 1000 },
                        });
                    }
                })
                .catch((error) => {
                    console.error("API request failed:", error);
                    message.error({
                        content:
                            error.response?.data?.message ||
                            "Something went wrong. Please try again later.",
                        style: { zIndex: 1000 },
                    });
                });

        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!popupTriggered) {
                setShowPopup(true);
                setPopupTriggered(true);
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [popupTriggered]);

    return (
        <div>
            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <img
                            className={styles.bgImage}
                            src='/assets/Topographic.png'
                            alt=''
                            loading='lazy'
                        />
                        <div className={styles.headerContainer}>
                            <h1 className={styles.header}>
                                Your Next Big Campaign Starts Here!
                            </h1>
                            <>
                                <img
                                    className={styles.desktopImage}
                                    src='/assets/popup_brands.png'
                                    alt='Popup Brands'
                                    loading='lazy'
                                />
                                <img
                                    className={styles.mobileImage}
                                    src='/assets/popup_brands_mobile.png'
                                    alt='Popup Brands'
                                />
                            </>
                        </div>
                        <div className={styles.formContainer}>
                            <div onClick={() => setShowPopup(false)}>
                                <img
                                    className={styles.closeIcon}
                                    src='/assets/close.png'
                                    alt=''
                                />
                            </div>
                            <form
                                className={styles.formInputs}
                                onSubmit={handleSubmit}
                            >
                                <h2 className={styles.secondHeader}>
                                    Get started with Faym’s bespoke <br />
                                    <span className={styles.highlight}>
                                        Influencer Marketing Services
                                    </span>
                                </h2>
                                <div className={styles.inputContainer}>
                                    <input
                                        type='text'
                                        name='fullName'
                                        placeholder='Full Name'
                                        value={formValues.fullName}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        autoComplete='off'
                                        required
                                    />
                                    <div className={styles.phoneInput}>
                                        <span>+91</span>
                                        <input
                                            name='mobileNumber'
                                            placeholder='Mobile Number'
                                            value={formValues.mobileNumber}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            type='tel'
                                            autoComplete='off'
                                            required
                                            pattern='[0-9]{10}'
                                            minLength={10}
                                            maxLength={10}
                                        />
                                    </div>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder='Enter your work Email'
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        autoComplete='off'
                                        required
                                    />
                                </div>

                                <button type='submit' className={styles.button}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;
