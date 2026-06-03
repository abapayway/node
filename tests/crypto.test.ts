import { generateKeyPairSync } from "node:crypto";
import { rsaEncrypt } from "../src/utils/crypto";

describe("rsaEncrypt", () => {
  it("encrypts data and returns base64", () => {
    const { publicKey } = generateKeyPairSync("rsa", { modulusLength: 1024 });
    const pem = publicKey.export({ type: "spki", format: "pem" }) as string;
    const plain = JSON.stringify({ mc_id: "ec000002", tran_id: "123" });

    const encrypted = rsaEncrypt(plain, pem);
    expect(typeof encrypted).toBe("string");
    expect(Buffer.from(encrypted, "base64").length).toBeGreaterThan(0);
  });

  it("handles payloads longer than 117 bytes", () => {
    const { publicKey } = generateKeyPairSync("rsa", { modulusLength: 1024 });
    const pem = publicKey.export({ type: "spki", format: "pem" }) as string;
    const longPlain = "x".repeat(250);

    const encrypted = rsaEncrypt(longPlain, pem);
    expect(encrypted.length).toBeGreaterThan(0);
  });
});
