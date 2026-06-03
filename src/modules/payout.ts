import { API_PATHS } from "../constants.js";
import type {
  PayoutBeneficiaryResponse,
  PayoutCreateOptions,
  PayoutCreateResponse,
  UpdateBeneficiaryStatusOptions,
  WhitelistBeneficiaryOptions,
} from "../types/payout.js";
import { rsaEncrypt } from "../utils/crypto.js";
import { ValidationError } from "../utils/errors.js";
import { buildHash } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * Payout / funds routing to beneficiaries.
 */
export class PayoutModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Split and distribute payments to third parties or ABA accounts.
   */
  async create(options: PayoutCreateOptions): Promise<PayoutCreateResponse> {
    const rsaKey = this.http.rsaPublicKey;
    if (!rsaKey) {
      throw new ValidationError("rsaPublicKey is required in client config for payout operations");
    }

    const beneficiariesInfo = JSON.stringify(
      options.beneficiaries.map((b) => ({ account: b.account, amount: b.amount })),
    );
    const beneficiaries = rsaEncrypt(beneficiariesInfo, rsaKey);
    const customFields =
      options.customFields !== undefined ? JSON.stringify(options.customFields) : "";

    const hashValues = {
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      beneficiaries,
      amount: String(options.amount),
      custom_fields: customFields,
      currency: options.currency,
    };

    const body = {
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      beneficiaries,
      amount: options.amount,
      currency: options.currency,
      custom_fields: customFields || undefined,
      hash: buildHash(
        hashValues,
        ["merchant_id", "tran_id", "beneficiaries", "amount", "custom_fields", "currency"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<PayoutCreateResponse>({
      path: API_PATHS.payout,
      body: body as Record<string, string | number | undefined>,
    });
    assertApiSuccess(response.status, "Payout failed");
    return response;
  }

  /**
   * Toggle a beneficiary between active and inactive.
   */
  async updateBeneficiaryStatus(
    beneficiaryId: string,
    status: UpdateBeneficiaryStatusOptions["status"],
  ): Promise<PayoutBeneficiaryResponse> {
    const hashValues = {
      merchant_id: this.http.merchantId,
      beneficiary_id: beneficiaryId,
      status: String(status),
    };

    const body = {
      ...hashValues,
      hash: buildHash(hashValues, ["merchant_id", "beneficiary_id", "status"], this.http.apiKey),
    };

    const response = await this.http.request<PayoutBeneficiaryResponse>({
      path: API_PATHS.payoutBeneficiaryStatus,
      body,
    });
    assertApiSuccess(response.status, "Update beneficiary status failed");
    return response;
  }

  /**
   * Whitelist an account before using it in payout requests.
   */
  async addBeneficiaryToWhitelist(
    options: WhitelistBeneficiaryOptions,
  ): Promise<PayoutBeneficiaryResponse> {
    const hashValues = {
      merchant_id: this.http.merchantId,
      account: options.account,
      name: options.name,
      currency: options.currency,
    };

    const body: Record<string, string> = {
      merchant_id: this.http.merchantId,
      account: options.account,
      currency: String(options.currency),
      hash: buildHash(hashValues, ["merchant_id", "account", "name", "currency"], this.http.apiKey),
    };
    if (options.name) body.name = options.name;

    const response = await this.http.request<PayoutBeneficiaryResponse>({
      path: API_PATHS.payoutWhitelist,
      body,
    });
    assertApiSuccess(response.status, "Whitelist beneficiary failed");
    return response;
  }
}
