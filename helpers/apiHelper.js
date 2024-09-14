import { decrypt } from "./helper";

export const requestAPI = async(URL, requestOptions) => {
    try {
        const response = await fetch(URL, requestOptions);
        const encryptedData = await response.text();
        let data = await decrypt(encryptedData);
        return data;
    }catch(err) {
        console.log(err,'errorData');
        throw err;
    }
};