// Static exchange rates as of early 2026 (relative to USD)
// Update periodically — these are for ballpark estimates only.

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateFromUsd: number; // 1 USD = rateFromUsd of this currency
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",  name: "US Dollar",        rateFromUsd: 1.0   },
  { code: "EUR", symbol: "€",  name: "Euro",              rateFromUsd: 0.92  },
  { code: "GBP", symbol: "£",  name: "British Pound",     rateFromUsd: 0.79  },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar",  rateFromUsd: 1.36  },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rateFromUsd: 1.55  },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];
