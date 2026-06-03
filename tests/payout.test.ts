jest.mock("../src/utils/crypto", () => ({
  rsaEncrypt: jest.fn().mockReturnValue("mock_encrypted_beneficiaries"),
}));

import { BeneficiaryStatus, Currency } from "../src/types/common";
import { createTestClient, mockFetch } from "./helpers";
import payoutMocks from "./mocks/payout.json";

describe("PayoutModule", () => {
  it("creates a payout", async () => {
    mockFetch((url) => {
      expect(url).toContain("/payout");
      return payoutMocks.create;
    });

    const result = await createTestClient().payout.create({
      orderId: "A17259584044451",
      amount: 3.44,
      currency: Currency.USD,
      beneficiaries: [
        { account: "200030000", amount: 1.72 },
        { account: "012538302", amount: 1.72 },
      ],
    });

    expect(result.beneficiaries).toHaveLength(1);
  });

  it("updates beneficiary status", async () => {
    mockFetch(() => payoutMocks.updateBeneficiary);
    const result = await createTestClient().payout.updateBeneficiaryStatus(
      "ben_1",
      BeneficiaryStatus.INACTIVE,
    );
    expect(result.status.code).toBe("0");
  });

  it("whitelists a beneficiary account", async () => {
    mockFetch(() => payoutMocks.whitelist);
    const result = await createTestClient().payout.addBeneficiaryToWhitelist({
      account: "200030000",
      currency: Currency.USD,
    });
    expect(result.status.message).toBe("Success!");
  });
});
