import { constants, publicEncrypt } from "node:crypto";

/**
 * RSA encrypt data in chunks (117 bytes max per chunk for 1024-bit keys)
 * and return Base64-encoded ciphertext for `merchant_auth` fields.
 */
export function rsaEncrypt(plainText: string, publicKeyPem: string): string {
  const buffer = Buffer.from(plainText, "utf8");
  const maxLength = 117;
  const chunks: Buffer[] = [];

  for (let offset = 0; offset < buffer.length; offset += maxLength) {
    const chunk = buffer.subarray(offset, offset + maxLength);
    const encrypted = publicEncrypt(
      {
        key: publicKeyPem,
        padding: constants.RSA_PKCS1_PADDING,
      },
      chunk,
    );
    chunks.push(encrypted);
  }

  return Buffer.concat(chunks).toString("base64");
}
