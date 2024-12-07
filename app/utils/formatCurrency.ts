interface iAppProps {
  amount: number;
  currency: "KES" | "USD";
}

export function formatCurrency({amount,currency}:iAppProps) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
