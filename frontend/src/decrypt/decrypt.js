import CryptoJS from "crypto-js";

const secretKey = "mySecretKey";

export const decryptData = (encryptedData, iv) => {

    try {

        const key = CryptoJS.SHA256(secretKey);

        const encryptedHex = CryptoJS.enc.Hex.parse(encryptedData);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encryptedHex },
            key,
            {
                iv: CryptoJS.enc.Hex.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        const result = decrypted.toString(CryptoJS.enc.Utf8);

        if (!result) return null;

        return JSON.parse(result);

    } catch (err) {
        console.log("Decrypt Error:", err);
        return null;
    }

};