"use server"

export interface RazorpayConfig {
  keyId: string;
  currency: string;
  name: string;
  description: string;
}

export async function getRazorpayConfig(): Promise<RazorpayConfig> {
  return {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    currency: "INR",
    name: "Cleaning E-commerce",
    description: "Payment for your order"
  }
}

export interface CreateOrderResponse {
  id: string;
  currency: string;
  amount: number;
}

export interface RazorpayOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}
