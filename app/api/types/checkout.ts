export interface ShippingAddress {
  details: string; // street address
  phone: string;
  city: string;
}

export interface SavedAddress extends ShippingAddress {
  id: string;
  label: string; // e.g. "Sadat City" — what shows as the bold title on the card
}

export type PaymentMethod = "cash" | "online";
