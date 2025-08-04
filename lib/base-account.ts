import { pay, getPaymentStatus, createBaseAccountSDK } from "@base-org/account";

export const baseAccount = createBaseAccountSDK({
  appName: "Vendio",
});

export async function createPayment(params: {
  amount: number;
  to: string;
  message?: string;
  testnet?: boolean;
}) {
  try {
    const paymentResult = await pay({
      amount: params.amount.toFixed(2),
      to: params.to,
      testnet: params.testnet || process.env.NODE_ENV !== "production",
      payerInfo: {
        requests: [
          { type: "email", optional: true },
          { type: "name", optional: true },
        ],
        callbackURL: `${window.location.origin}/api/payment-callback`,
      },
    });

    return paymentResult;
  } catch (error) {
    console.error("Payment creation failed:", error);
    throw error;
  }
}

export async function checkPaymentStatus(paymentId: string) {
  try {
    const status = await getPaymentStatus({ id: paymentId });
    return status;
  } catch (error) {
    console.error("Failed to get payment status:", error);
    throw error;
  }
}
