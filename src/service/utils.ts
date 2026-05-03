import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;
const token = process.env.REACT_APP_TOKEN;

export const getAPIData: any = (data: any) => {
    return axios.get(baseUrl + "/" + data?.url, {
        params: {
            ...data.data,
        },
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    });
};

export const postAPI = (url: string, data: any) => {
    return axios.post(
        baseUrl + "/" + url,
        {
            data,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": `application/json`,
            },
        }
    );
};

export function splitStringIntoNumber(input: string): number {
    const number = parseInt((input.match(/\d+/g) || []).join(""), 10) || 0;
    return number;
}
export function splitStringIntoNonNumber(input: string): string {
    const nonNumber = (input.match(/[^\d]+/g) || []).join("");
    return nonNumber;
}

export const brandsTextMap = new Map<string, string>([
    ["MEESHO", "/assets/dealsPage/meesho-text.png"],
    ["MYNTRA", "/assets/dealsPage/myntra-text.png"],
    ["FLIPKART", "/assets/dealsPage/flipkart-text.png"],
]);

export const brandDealsTomorrowMap = new Map<string, string>([
    ["LEVIS", "/assets/dealsPage/levis-brand-deal-tomorrow.png"],
    ["PUMA", "/assets/dealsPage/puma-brand-deal-tomorrow.png"],
]);

export const discountMap = new Map<number, string>([
    [60, "/assets/dealsPage/60-percent.png"],
    [45, "/assets/dealsPage/45-percent.png"],
]);
