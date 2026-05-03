import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import { useLocation } from "react-router-dom";
import { signToken } from "../../../service/cypher";

function FaqSec() {
    const [selected, setSelected] = useState<number | null>(null);
    const location = useLocation();
    const [faqs, setFaqs] = useState<any[]>([]);

    const toggle = (i: number) => {
        if (selected === i) {
            return setSelected(null);
        }
        setSelected(i);
    };

    const getFaqs = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/utils/faqs",
                token: token,
            });
            if (response) {
                switch (location.pathname) {
                    case "/faqs":
                        setFaqs(response.data);
                        break;
                    default:
                        setFaqs(response.data.slice(0, 4));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getFaqs();
    }, []);

    return (
        <div className={styles.container} data-theme='light'>
            {window.innerWidth <= 500 ? (
                <h2 className={styles.heading}>
                    Frequently <div>Asked Questions</div>
                </h2>
            ) : (
                <h2 className={styles.heading}>Frequently Asked Questions</h2>
            )}
            {window.innerWidth <= 500 ? (
                <p className={styles.subheading}>
                    Here's Everything You Need to <br />
                    Know About Faym
                </p>
            ) : (
                <p className={styles.subheading}>
                    Here's Everything You Need to Know About Faym
                </p>
            )}

            <div className={styles.faqs}>
                {faqs.map((faq, index) => (
                    <div
                        className={`${styles.faq} ${
                            selected === index ? styles.open : ""
                        }`}
                        key={index}
                        onClick={() => toggle(index)}
                    >
                        <div
                            className={`${styles.faqQuestion} ${
                                selected === index ? styles.faqQuestionBold : ""
                            }`}
                        >
                            {faq.question}
                        </div>
                        <div className={styles.faqAnswer}>{faq.answer}</div>
                    </div>
                ))}
                <div
                    className={styles.redirectButton}
                    style={{
                        display: location.pathname === "/faqs" ? "none" : "",
                        marginBottom: "15px",
                    }}
                >
                    <a
                        href='/faqs'
                        className={styles.redirectText}
                        target='_blank'
                    >
                        View more FAQs
                    </a>
                    <img
                        src='/assets/redirectIcon.svg'
                        alt='arrow'
                        className={styles.redirectIcon}
                        loading='lazy'
                    />
                </div>
            </div>
        </div>
    );
}

export default FaqSec;
