import type { BeneficiaryStatus, Currency, PayWayStatus } from "./common.js";

export interface PayoutCreateOptions {
  orderId: string;
  amount: number;
  currency: Currency | string;
  beneficiaries: Array<{ account: string; amount: number }>;
  customFields?: Record<string, unknown>;
}

export interface PayoutBeneficiaryResult {
  payout_id: string;
  name: string;
  mid_acccount: string;
  amount: number;
  currency: string;
}

export interface PayoutCreateResponse {
  transaction_id: string;
  transaction_date: string;
  external_reference?: string;
  apv?: string;
  transaction_amount: number;
  transaction_currency: string;
  beneficiaries: PayoutBeneficiaryResult[];
  status: PayWayStatus;
}

export interface UpdateBeneficiaryStatusOptions {
  status: BeneficiaryStatus | string;
}

export interface WhitelistBeneficiaryOptions {
  account: string;
  name?: string;
  currency: Currency | string;
}

export interface PayoutBeneficiaryResponse {
  status: PayWayStatus;
}
