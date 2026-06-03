import {
  ABAPayWayError,
  AuthenticationError,
  RefundError,
  TokenError,
  TransactionError,
  ValidationError,
  WebhookError,
  throwApiError,
} from "../src/utils/errors";

describe("error classes", () => {
  it("covers all error subclasses", () => {
    expect(new TransactionError("tx").name).toBe("TransactionError");
    expect(new RefundError("rf").name).toBe("RefundError");
    expect(new TokenError("tk").name).toBe("TokenError");
    expect(new WebhookError("wh").name).toBe("WebhookError");
  });

  it("throwApiError throws mapped types", () => {
    expect(() => throwApiError("auth", "auth")).toThrow(AuthenticationError);
    expect(() => throwApiError("val", "validation")).toThrow(ValidationError);
    expect(() => throwApiError("tx", "transaction")).toThrow(TransactionError);
    expect(() => throwApiError("rf", "refund")).toThrow(RefundError);
    expect(() => throwApiError("tk", "token")).toThrow(TokenError);
  });

  it("ABAPayWayError defaults code to UNKNOWN", () => {
    const err = new ABAPayWayError("generic");
    expect(err.code).toBe("UNKNOWN");
  });
});
