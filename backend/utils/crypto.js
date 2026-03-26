const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update("mySecretKey").digest();

function encryptData(data) {

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted
  };
}

module.exports = encryptData;