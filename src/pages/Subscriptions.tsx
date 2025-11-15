import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
  resumeSubscription,
  createPortalSession,
  SubscriptionPlan,
} from '../services/stripeApi';

// Subscription pricing plans
const PRICING_PLANS = [
  {
    id: 'price_1STlSpBlnxS6RUbet4usuAH3', // Live Stripe Price ID
    name: 'Basic Plan',
    price: 9.99,
    interval: 'month',
    features: [
      'Access to all Bible verses',
      'Interactive memorization tools',
      'Progress tracking',
      'Personalized learning journey',
      'Mobile-friendly experience',
    ],
    popular: true, // Highlight this as the only plan
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for success/cancel from Stripe redirect
  useEffect(() => {
    if (searchParams.get('success')) {
      setSuccess('Subscription successful! Thank you for subscribing.');
      // Clear URL params
      window.history.replaceState({}, '', '/subscriptions');
    }
    if (searchParams.get('canceled')) {
      setError('Subscription canceled. You can try again anytime.');
      // Clear URL params
      window.history.replaceState({}, '', '/subscriptions');
    }
  }, [searchParams]);

  // Load subscription status
  useEffect(() => {
    if (user && token) {
      loadSubscriptionStatus();
    }
  }, [user, token]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await getSubscriptionStatus(token!);
      setHasSubscription(status.hasSubscription);
      setSubscriptions(status.subscriptions);
    } catch (err: any) {
      console.error('Error loading subscription status:', err);
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create checkout session
      const session = await createCheckoutSession(
        priceId,
        user.id,
        user.email,
        token
      );

      // Redirect to Stripe Checkout using the session URL
      window.location.href = session.url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!token) return;

    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cancelSubscription(subscriptionId, token);
      setSuccess('Subscription will be canceled at the end of the billing period');
      await loadSubscriptionStatus();
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      await resumeSubscription(subscriptionId, token);
      setSuccess('Subscription resumed successfully');
      await loadSubscriptionStatus();
    } catch (err: any) {
      console.error('Error resuming subscription:', err);
      setError('Failed to resume subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const portal = await createPortalSession(token);
      window.location.href = portal.url;
    } catch (err: any) {
      console.error('Error creating portal session:', err);
      setError('Failed to open billing portal');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Please <a href="/login">log in</a> to view subscription options.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Subscription Plans</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* Active Subscriptions */}
      {hasSubscription && subscriptions.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">Your Active Subscriptions</h2>
          {subscriptions.map((sub) => (
            <div key={sub.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="card-title">{sub.plan.name}</h5>
                    <p className="card-text">
                      <strong>Status:</strong> {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      <br />
                      <strong>Amount:</strong> ${sub.plan.amount.toFixed(2)}/{sub.plan.interval}
                      <br />
                      <strong>Next billing date:</strong> {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      {sub.cancelAtPeriodEnd && (
                        <>
                          <br />
                          <span className="text-danger">
                            <strong>Cancels on:</strong> {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="col-md-4 text-end">
                    {sub.cancelAtPeriodEnd ? (
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleResumeSubscription(sub.id)}
                        disabled={loading}
                      >
                        Resume Subscription
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-danger me-2"
                        onClick={() => handleCancelSubscription(sub.id)}
                        disabled={loading}
                      >
                        Cancel Subscription
                      </button>
                    )}
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleManageBilling}
                      disabled={loading}
                    >
                      Manage Billing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Plans */}
      <h2 className="text-center mb-4">
        {hasSubscription ? 'Upgrade Your Plan' : 'Choose Your Plan'}
      </h2>

      <div className="row">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.id} className="col-md-4 mb-4">
            <div className={`card h-100 ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="card-header bg-primary text-white text-center">
                  <strong>Most Popular</strong>
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{plan.name}</h5>
                <h2 className="text-center mb-4">
                  ${plan.price}
                  <small className="text-muted">/{plan.interval}</small>
                </h2>
                <ul className="list-unstyled mb-4 flex-grow-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-5">
        <h3>Subscription Details</h3>
        <div className="accordion" id="subscriptionFAQ">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                Can I cancel anytime?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#subscriptionFAQ">
              <div className="accordion-body">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                What payment methods do you accept?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#subscriptionFAQ">
              <div className="accordion-body">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                Can I upgrade or downgrade my plan?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#subscriptionFAQ">
              <div className="accordion-body">
                Yes! You can change your plan at any time through the "Manage Billing" portal. Changes will be prorated based on your billing cycle.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
