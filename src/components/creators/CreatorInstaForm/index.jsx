import {useState} from "react";
import styles from "./index.module.css";
import {postAPI} from "../../../service/utils";
import { message} from "antd";
import { useLocation } from "react-router-dom";

const Index = ({closeForm, onSuccess}) => {

  let location = useLocation();
  let referredBy = location?.search?.split("?")[1]?.split("=")[1]

  const [instaUsername, setInstaUsername] = useState("")
  const [mobileNumber, setMobileNumber] = useState("");

  const handleKeyPress = (e) => {
    //check if key is enter then submit the form
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }


  const handleSubmit = async (e) => {
    const buttonEle = document.getElementsByClassName(styles.getStartedButton)[0];
    buttonEle.disabled = true;
    const regex = /^\d{10}$/;
    if(instaUsername.length < 1 || instaUsername.includes(" ") ||  !regex.test(mobileNumber)){
      message.error({content: "Please Provide Valid Details",  style: {
        zIndex: 1000, // Set the desired z-index
      }});
      buttonEle.disabled = false;
      return;
      
    }

    const data = {
      instaUsername,
      phoneNumber: "+91" + mobileNumber,
      page: "Creators",
      referral: referredBy ? referredBy : ""
    };

    try {
      const response = await postAPI(`api/website/creators/instagram/info`, data);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem(referredBy? referredBy + "/submitted": "No Referral" + "/submitted", true)
        buttonEle.disabled = false;
        onSuccess();
        return;
      }}
    catch (error) {
      console.error(error);
      message.error({content: "Something went wrong",  style: {
        zIndex: 1000, // Set the desired z-index
      }});
      buttonEle.disabled = false;
    }
    buttonEle.disabled = false;
  };
  return (
    <div className={styles.bgOverlay} onClick={closeForm}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <img className={styles.coinsBg} src="/assets/coinsBg.png" alt=""/>
        <img className={styles.confettiBg1} src="/assets/confettiBackground.png" alt="" />
        <img className={styles.confettiBg2} src="/assets/confettiBackground.png" alt="" />
        <img className={styles.closeIcon}  onClick={closeForm} src="/assets/closeIcon.png" alt="Close"/>
        <div className={styles.formContainer}>
          <span className={styles.heading}>Join <span className={styles.highlight}>5,000+ creators</span> earning highest commissions on top brands!</span>
          <div className={styles.inputsContainer}>
            <div className={styles.formInput}>
              <label className={styles.label}>Instagram User Name*</label>
              <div className={styles.inputContainer}>
                <span className={styles.inputPrefix}>instagram.com/</span>
                <input type="text" className={styles.inputField} minLength="1" maxLength="40" value={instaUsername} onChange={(e) => setInstaUsername(e.target.value) } required/>
              </div>
            </div>
            <div className={styles.formInput}>
              <label className={styles.label}>Phone Number*</label>
              <div className={styles.inputContainer}>
                <span className={styles.inputPrefix}>+91</span>
                <input className={styles.inputField} type="phone" minLength="10" maxLength="10" value={mobileNumber} onKeyDown={handleKeyPress} onChange={(e) => {setMobileNumber(e.target.value)}} required/>
              </div>
            </div>
          </div>
          <button className={styles.getStartedButton} onClick={handleSubmit}>Submit</button>
        </div>
        <div className={styles.imageContainer}>
          <img className={styles.imageWeb} src='/assets/commissionBanner.png' alt=""/>
          <img className={styles.imageMobile} src='/assets/commissionBannerMobile.png' alt="" />
        </div>
      </div>
    </div>
  );
};

export default Index;
