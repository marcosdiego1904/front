import axios from 'axios';

// Use the same API base URL as the rest of the app
const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.lamptomyfeet.co'
  : 'http://localhost:5000';

const stripeApi = axios.create({
  baseURL: `${API_BASE_URL}/api/stripe`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SubscriptionPlan {
  id: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  plan: {
    name: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

export interface SubscriptionStatusResponse {
  hasSubscription: boolean;
  subscriptions: SubscriptionPlan[];
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface StripeConfigResponse {
  publishableKey: string;
}

// Get Stripe publishable key
export const getStripeConfig = async (): Promise<StripeConfigResponse> => {
  const response = await stripeApi.get<StripeConfigResponse>('/config');
  return response.data;
};

// Create a checkout session for subscription
export const createCheckoutSession = async (
  priceId: string,
  userId: number,
  userEmail: string,
  token: string
): Promise<CheckoutSessionResponse> => {
  // Get current origin to build proper return URLs
  const currentOrigin = window.location.origin;

  const response = await stripeApi.post<CheckoutSessionResponse>(
    '/create-checkout-session',
    {
      priceId,
      userId,
      userEmail,
      successUrl: `${currentOrigin}/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${currentOrigin}/subscriptions?canceled=true`,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get user's subscription status
export const getSubscriptionStatus = async (
  token: string
): Promise<SubscriptionStatusResponse> => {
  const response = await stripeApi.get<SubscriptionStatusResponse>(
    '/subscription-status',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Cancel subscription
export const cancelSubscription = async (
  subscriptionId: string,
  token: string
): Promise<{ success: boolean; subscription: any }> => {
  const response = await stripeApi.post(
    '/cancel-subscription',
    { subscriptionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Resume subscription
export const resumeSubscription = async (
  subscriptionId: string,
  token: string
): Promise<{ success: boolean; subscription: any }> => {
  const response = await stripeApi.post(
    '/resume-subscription',
    { subscriptionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Create customer portal session
export const createPortalSession = async (
  token: string
): Promise<{ url: string }> => {
  const response = await stripeApi.post(
    '/create-portal-session',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default stripeApi;
