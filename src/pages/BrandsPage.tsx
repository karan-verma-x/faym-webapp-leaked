import "../global.css";
import NavBar from "../components/CommonComponents/Navbar";
import TopSection from "../components/brands/TopSection";
import StatsComponent from "../components/brands/StatsComponent";
import Flyers from "../components/brands/Flyers";
import Brands from "../components/brands/BrandsCarousel";
import BrandsServices from "../components/brands/BrandsServices";
import Features from "../components/brands/Features";
import CreatorsCarousel from "../components/brands/CreatorsSection";
import CaseStudy from "../components/brands/CaseStudy";
import Testimonial from "../components/brands/Testimonial";
import ContactUs from "../components/CommonComponents/ContactUs";
import Footer from "../components/CommonComponents/Footer";
import PopUpForm from "../components/brands/PopUpForm/index";

const BrandsPage = () => {
    return (
        <>
            <NavBar />
            <TopSection />
            <StatsComponent />
            <Flyers />
            {/* <Steps /> */}
            <Brands />
            <BrandsServices />
            <Features />
            <CreatorsCarousel />
            <CaseStudy />
            <Testimonial />
            <ContactUs />
            <Footer />
            <PopUpForm/>
        </>
    );
};

export default BrandsPage;
