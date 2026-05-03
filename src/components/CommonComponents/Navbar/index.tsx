import { useEffect, useState } from "react";
import styles from "./index.module.css";
import ReactGA from "react-ga4";
import mixpanel from "mixpanel-browser";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const NavBar = (obj: any) => {
    const handleLinkClick = (obj: { category: string; action: string }) => {
        mixpanel.track("Navigation link", obj);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [navItems, setNavItems] = useState([
        {
            label: "Brands",
            link: "/",
            isLink: true,
            icon: "",
            target: false,
            isSocailMedia: false,
        },
        {
            label: "Creators",
            link: "/creators",
            isLink: true,
            icon: "",
            target: false,
            isSocailMedia: false,
        },
        {
            label: "Features",
            link: "#features",
            isLink: true,
            icon: "",
            isSocailMedia: false,
        },
        {
            label: window.location.href.includes("creators")
                ? "Get Started"
                : "Let's Connect",
            link: window.location.href.includes("creators")
                ? "https://faym.co/dashboard"
                : "#contactus",
            isLink: false,
            icon: "/assets/right_arrow.png",
            target: false,
            isSocailMedia: false,
        },
        {
            label: "",
            link: "https://in.linkedin.com/company/getfaym",
            isLink: true,
            icon: "/assets/linkedin_black.svg",
            target: true,
            isSocailMedia: true,
        },
        {
            label: "",
            link: "https://instagram.com/faym.co",
            isLink: true,
            icon: "/assets/instagram_black.svg",
            target: true,
            isSocailMedia: true,
        },
    ]);

    useEffect(() => {
        if (window.location.pathname.split("/")[1] === "casestudies") {
            setNavItems(navItems.filter((ele) => ele.link !== "#contactus"));
        }
    }, []);

    const [isHidden, setIsHidden] = useState(false);
    const [navbarColor, setNavbarColor] = useState(
    window.location.pathname === "/creators" ? "black" :"white"
    );

    return (
        <div
            id='navbar'
            className={`${styles.navWrapper} ${
                isHidden && styles.navbarHidden
            }`}
            style={window.location.pathname !== "/creators" ? { backgroundColor: "#1E1E1E", borderBottom: "0.5px solid #5f5f5f"} : {boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.05)"}}
        >
            <div className={styles.logo}>
                <Link to='/'>
                    <img loading='lazy' src='/assets/logo.png' alt='Logo' />
                </Link>
            </div>
            <div
                className={`${styles.navItems} ${
                    isMenuOpen && styles.mobileNavItems
                }`}
            >
                {navItems.map((items, index) => {
                    return items.isLink ? (
                        <div className={styles.navbarLinkWrapper} key={index}>
                            <Link
                                key={index}
                                className={`${styles.navLinks} ${
                                    items.isSocailMedia &&
                                    styles.socialMediaLink
                                }`}
                                to={items.link}
                                target={items.target ? "_blank" : ""}
                                onClick={() => {
                                    ReactGA.event({
                                        category: "nav",
                                        action: `${items.label}`,
                                    });
                                    handleLinkClick({
                                        category: "nav",
                                        action: `${items.label}`,
                                    });
                                    setIsMenuOpen(false);
                                }}
                                style={{
                                    color: navbarColor,
                                }}
                            >
                                {items.label}
                                {items.icon !== "" && (
                                    <img
                                        src={items.icon}
                                        style={{
                                            color: navbarColor,
                                        }}
                                    />
                                )}
                            </Link>
                            <div
                                className={`${styles.indicator} ${
                                    location.pathname === items.link &&
                                    styles.indicatorActive
                                }`}
                            ></div>
                        </div>
                    ) : (
                        !isMenuOpen && (
                            <a
                                key={index}
                                className={`${styles.navBtn} ${
                                    items.isSocailMedia &&
                                    styles.socialMediaLink
                                }`}
                                href={items.link}
                            >
                                {items.label}
                                {items.icon !== "" && (
                                    <img
                                        className={styles.rightArrow}
                                        src={items.icon}
                                        alt='right arrow'
                                    />
                                )}
                            </a>
                        )
                    );
                })}
            </div>
            <div
                className={`${styles.mobileView} ${
                    isMenuOpen && styles.activeMobileView
                }`}
            >
            {window.location.pathname.split("/")[1]!=="casestudies"&&(

              <a 
              className={styles.getStartedButton}
              target={window.location.pathname==="/creators"?"_blank":"_self"} href={window.location.pathname==="/creators"? "/login":"#contactus"}>{
                window.location.pathname==="/creators"? "Get Started":"Let's Connect"}
                <img
                  className={styles.rightArrow}
                  src="/assets/right_arrow.png"
                  alt='right arrow'
                />
              </a>
            )}

                <div
                    className={`${styles.hamburgerMenu} ${
                        isMenuOpen && styles.toggleActive
                    }`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span
                        className={styles.hamLines}
                        style={{
                          backgroundColor: ` ${window.location.pathname==="/" && isMenuOpen ? "black":navbarColor}`,
                        }}
                    ></span>
                    <span
                        className={styles.hamLines}
                        style={{
                          backgroundColor: ` ${window.location.pathname==="/" && isMenuOpen ? "black":navbarColor}`,
                        }}
                    ></span>
                    <span
                        className={styles.hamLines}
                        style={{
                          backgroundColor: ` ${window.location.pathname==="/" && isMenuOpen ? "black":navbarColor}`,
                        }}
                    ></span>
                </div>
            </div>
        </div>
    );
};

export default NavBar;