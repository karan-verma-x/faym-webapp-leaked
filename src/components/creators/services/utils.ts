import { isAndroid, isIOS, isMobile } from "react-device-detect";
export const handleButtonClick = (inputValue: string | null) => {
     let url;
     if (inputValue) {
         url = `${process.env.REACT_APP_URL}/login?username=${inputValue}`;
     } else {
         url = `${process.env.REACT_APP_URL}/dashboard`;
     }

    if (isMobile) {
        if (isAndroid) {
            window.open(
                "https://play.google.com/store/apps/details?id=com.application.faym&hl=en&gl=US",
                "_blank"
            );
        } else if (isIOS) {
            window.open(
                "https://apps.apple.com/in/app/faym/id6479986552",
                "_blank"
            );
        } else {
            window.open(url, "_blank");
        }
    } else {
        window.open(url, "_blank");
    }
};
