import React, {useEffect, useState} from "react";
import NavBar from "../components/CommonComponents/Navbar";
import Footer from "../components/CommonComponents/Footer";
import BrandsCarouselSetion from "../components/creators/BrandsCarouselSection";
import MonetizeSalesSection from "../components/creators/MonetizeSalesSection";
import PremiumFeaturesSection from "../components/creators/PremiumFeaturesSection";
import ContactUs from "../components/CommonComponents/ContactUs";
import FaqSection from "../components/creators/FaqSection";
import CreatorsCarouselSection from "../components/creators/CreatorsCarouselSection";
import HeroSection from "../components/creators/HeroSection";
import FaymstoreCreatorsSection from "../components/creators/FaymstoreCreatorsSection";
import {message} from "antd";
import { useLocation } from "react-router-dom";
import CreatorInstaForm from '../components/creators/CreatorInstaForm';
import FloatingBanner from '../components/creators/FloatingBanner';
import { postAPI } from "../service/utils";

const CreatorPage = () => {

  const [isCreatorInstaFormOpened, setIsCreatorInstaFormOpened] = useState(false);
  const [isFloatingBannerOpened, setisFloatingBannerOpened] = useState(false);


  const handleFormSubmissionSuccess=() => {
    setisFloatingBannerOpened(false);
    setIsCreatorInstaFormOpened(false);
    message.success("Form submitted successfully");
  }

  let location = useLocation();
  let referredBy = location?.search?.split("?")[1]?.split("=")[1]

  const sendReferral = async () => {
    const data = {
      referral: referredBy ? referredBy : "",
      url: window.location.href
    };
    try {
        const response = await postAPI(`api/website/creators/referral`, data);
        if (response.status === 200) {
          const data = response.data;
          localStorage.setItem((referredBy ? referredBy : "No Referral"), data.requestReceived);
        }
    } catch (error) {
        console.error(error);
    }
};

  useEffect(() => {
    if (
        !localStorage.getItem(
            `${referredBy ? referredBy : "No Referral"}/submitted`
        )
    ) {
        setTimeout(() => {
            setIsCreatorInstaFormOpened(true);
        }, 3000);
    }
    if (!localStorage.getItem(referredBy ? referredBy : "No Referral")) {
        sendReferral();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    return (
        <div>
            <NavBar />
            <HeroSection />
            <MonetizeSalesSection />
            <BrandsCarouselSetion />
            <PremiumFeaturesSection />
            <FaymstoreCreatorsSection />
            <CreatorsCarouselSection />
            <FaqSection />
            <ContactUs />
            <Footer />
            {isCreatorInstaFormOpened && <CreatorInstaForm closeForm={() => {setIsCreatorInstaFormOpened(false); setisFloatingBannerOpened(true);}} onSuccess={handleFormSubmissionSuccess} />}
            {isFloatingBannerOpened && <FloatingBanner onClick={()=>{setIsCreatorInstaFormOpened(true);
              setisFloatingBannerOpened(false);
            }}/>}
        </div>
    );
};

export default CreatorPage;
