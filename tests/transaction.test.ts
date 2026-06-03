import { createTestClient, mockFetch } from "./helpers";
import transactionMocks from "./mocks/transaction.json";

describe("TransactionModule", () => {
  it("retrieves transactions by merchant reference", async () => {
    mockFetch((url) => {
      expect(url).toContain("get-transactions-by-mc-ref");
      return transactionMocks.getByMerchantRef;
    });

    const result = await createTestClient().transaction.getByMerchantRef("REF-001");
    expect(result.data[0]?.merchant_ref).toBe("REF-001");
  });
});
