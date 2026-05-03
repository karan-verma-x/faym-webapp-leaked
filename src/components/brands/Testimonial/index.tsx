import { MouseEventHandler, useEffect, useState } from "react";
import styles from "./index.module.css";
import { getAPIData } from "../../../service/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common.css";
import { Testimoni } from "../../../DataModels/testimoni";
import { signToken } from "../../../service/cypher";

const Index = () => {
    const [testimonial, setTestimonial] = useState<Testimoni[]>([]);

    const getTestimoni = async () => {
        try {
            let token = await signToken();
            const response = await getAPIData({
                url: "api/website/testimoni",
                token: token,
            });
            if (response) {
                setTestimonial(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTestimoni();
    }, []);

    const NextArrow = (props: {
        onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    }) => {
        return (
            <button
                className={`${styles.arrowBtn} ${styles.nextArrow}`}
                onClick={props.onClick}
            >
                <img
                    className={styles.leftArrow}
                    src='/assets/arrowBtn.png'
                    alt='left arrow btn'
                />
            </button>
        );
    };

    const PrevArrow = (props: {
        onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    }) => {
        return (
            <button
                className={`${styles.arrowBtn} ${styles.previousArrow}`}
                onClick={props.onClick}
            >
                <img src='/assets/arrowBtn.png' alt='right arrow btn' />
            </button>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        nextArrow: <PrevArrow onClick={undefined} />,
        prevArrow: <NextArrow onClick={undefined} />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 3000,
                },
            },
        ],
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.topContainer}>
                <h4>
                    Hear it from our
                    {window.innerWidth < 768 && <br />} Top Clients
                </h4>
            </div>
            <div className={styles.bottomContainer}>
                <Slider {...settings}>
                    {testimonial?.map((item) => {
                        return (
                            <div key={item._id} className={styles.testimoni}>
                                <div className={styles.content}>
                                    <p>{item?.testimoni}</p>
                                </div>
                                <div className={styles.profileInfo}>
                                    <img
                                        src={item.profileImage}
                                        alt='profile image'
                                        loading='lazy'
                                    />
                                    <div className={styles.info}>
                                        <h5>{item.name}</h5>
                                        <h5>{`${item.designation} @ ${item.company}`}</h5>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};

export default Index;
