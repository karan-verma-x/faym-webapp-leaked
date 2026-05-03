import {
    Routes,
    Route,
    useNavigationType,
    useLocation,
    Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import TermsAndConditions from "./pages/TermsAndConditionPage";
import CreatorsPage from "./pages/CreatorPage";
import BrandsPage from "./pages/BrandsPage";
import BrandCaseStudiesPage from "./pages/BrandCaseStudiesPage";
import AllCaseStudiesPage from "./pages/AllCaseStudiesPage";
import FaqsPage from "./pages/FaqsPage";
import DealsPage from "./faymDeals/pages/root";

function App() {
    const action = useNavigationType();
    const location = useLocation();
    const pathname = location.pathname;
    const hostname = window.location.hostname;

    function onLoad(hostname: string, location: string, referral: string) {
        if (hostname.startsWith("deals")) {
            if (referral)
                ReactGA.event({
                    category: "Visited Deals Page",
                    action: "Referred User: " + referral.split("=")[1],
                    label: location + " | " + referral.split("=")[1],
                });
            else
                ReactGA.event({
                    category: "Visited Deals Page",
                    action: "Not referred User",
                    label: location,
                });
        } else {
            if (referral)
                ReactGA.event({
                    category: "Visited Website",
                    action: "Referred User: " + referral.split("=")[1],
                    label: location + " | " + referral.split("=")[1],
                });
            else
                ReactGA.event({
                    category: "Visited Website",
                    action: "Not referred User",
                    label: location,
                });
        }
    }

    useEffect(() => {
        if (action !== "POP") {
            window.scrollTo(0, 0);
        }
    }, [action, pathname]);

    useEffect(() => {
        const host = window.location.hostname; // faym.co OR deals.faym.co
        let title = "";
        let description = "";
        let image = "";

        switch (pathname) {
            case "/":
                if (host === "faym.co") {
                    title =
                        "Faym - Customize & connect everything at one place.";
                    description =
                        "Transform how you showcase your social media, digital products, and more in one go!";
                    image =
                        "https://faym-wall.s3.ap-south-1.amazonaws.com/og-image.jpg";
                } else if (host === "deals.faym.co") {
                    title = "Deals - Best Offers";
                    description = "Grab the hottest deals and discounts.";
                    image =
                        "https://fm-s3.blr1.cdn.digitaloceanspaces.com/meta-images/Meta%20Image%20Deals%20Page.jpg";
                }
                break;

            // add other routes here
        }

        if (title) document.title = title;

        if (description) {
            let tag = document.querySelector('meta[name="description"]');
            if (tag) tag.setAttribute("content", description);
        }

        if (image) {
            let tag = document.querySelector('meta[property="og:image"]');
            if (tag) tag.setAttribute("content", image);
        }
    }, [pathname]);

    useEffect(() => {
        const referral = window.location.search;
        ReactGA.send({
            hitType: "pageview",
            page: window.location.hostname,
        });
        onLoad(hostname, window.location.pathname, referral);
    }, [hostname]);

    if (hostname.startsWith("deals")) {
        return (
            <Routes>
                <Route path='/' element={<DealsPage />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path='/' element={<BrandsPage />} />
            <Route path='/faqs' element={<FaqsPage />} />
            <Route path='/creators' element={<CreatorsPage />} />
            <Route path='/casestudies' element={<AllCaseStudiesPage />} />
            <Route
                path='/casestudies/:brand/:id'
                element={<BrandCaseStudiesPage />}
            />
            <Route path='/tnc' element={<TermsAndConditions />} />
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
}
export default App;
