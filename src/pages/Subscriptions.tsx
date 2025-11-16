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
import { Check, X, Zap, Shield, TrendingUp, Users } from 'lucide-react';

// Subscription pricing plans
const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect to get started',
    features: [
      { text: 'Up to 10 verses total', included: true },
      { text: 'Proven 6-step learning method', included: true },
      { text: 'Ranks 1-3 unlocked (Saul, Nicodemus, Thomas)', included: true },
      { text: '5 topic categories (Faith, Hope, Love, Strength, Peace)', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Unlimited verses', included: false },
      { text: 'All 10 ranks (Saul → Solomon)', included: false },
      { text: '50+ topic categories', included: false },
      { text: 'Advanced analytics & insights', included: false },
      { text: 'Tournament eligibility', included: false },
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'price_1STlSpBlnxS6RUbet4usuAH3', // Live Stripe Price ID
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    description: 'Unlimited spiritual growth',
    features: [
      { text: 'Unlimited verses (no limits)', included: true, highlight: true },
      { text: 'All 10 ranks unlocked (Saul → Solomon Level)', included: true },
      { text: 'All topic categories (Faith, Hope, Love, Strength, Peace +)', included: true },
      { text: 'Advanced progress analytics', included: true },
      { text: 'Multiple Bible translations', included: true },
      { text: 'Tournament eligibility (launching January 2026)', included: true },
      { text: 'Certification eligibility at 50 verses (launching Q1 2026)', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to new features', included: true },
    ],
    cta: 'Get Pro Now',
    popular: true,
    badge: 'MOST POPULAR',
    valueStatement: 'Less than 2 coffees per month',
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
      setSuccess('Welcome to Premium! Your spiritual growth journey just accelerated.');
      window.history.replaceState({}, '', '/subscriptions');
    }
    if (searchParams.get('canceled')) {
      setError('No problem. Premium is here when you\'re ready to accelerate your growth.');
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

      const session = await createCheckoutSession(
        priceId,
        user.id,
        user.email,
        token
      );

      window.location.href = session.url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!token) return;

    if (!confirm('Are you sure? You\'ll still have access until the end of your billing period.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cancelSubscription(subscriptionId, token);
      setSuccess('Subscription will cancel at the end of your billing period');
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
      setSuccess('Welcome back! Your Premium access is restored.');
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to Transform?</h2>
          <p className="text-slate-600 mb-6">
            Log in to unlock Pro and memorize unlimited verses.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Log In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Spiritual Growth Accelerated</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Stop Forgetting Verses.<br />
            <span className="text-amber-400">Start Living Them.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            Memorize Bible verses 10x faster. No gimmicks. Just results.
          </p>

          <p className="text-slate-400 text-lg mb-8">
            Based on proven memory science. Built for believers who actually want to grow.
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">10 min</div>
              <div className="text-sm text-slate-400">Average per verse</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">10 Ranks</div>
              <div className="text-sm text-slate-400">Saul → Solomon</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">6 Steps</div>
              <div className="text-sm text-slate-400">Proven method</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-800">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Active Subscriptions */}
      {hasSubscription && subscriptions.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Pro Active</h2>
                <p className="text-slate-600">You're growing faster. Keep it up.</p>
              </div>
            </div>

            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl p-6 mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{sub.plan.name}</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p><strong>Status:</strong> {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</p>
                      <p><strong>Amount:</strong> ${sub.plan.amount.toFixed(2)}/{sub.plan.interval}</p>
                      <p><strong>Next billing:</strong> {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
                      {sub.cancelAtPeriodEnd && (
                        <p className="text-red-600 font-semibold">
                          Cancels on: {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {sub.cancelAtPeriodEnd ? (
                      <button
                        className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        onClick={() => handleResumeSubscription(sub.id)}
                        disabled={loading}
                      >
                        Resume Pro
                      </button>
                    ) : (
                      <button
                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                        onClick={() => handleCancelSubscription(sub.id)}
                        disabled={loading}
                      >
                        Cancel Subscription
                      </button>
                    )}
                    <button
                      className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      onClick={handleManageBilling}
                      disabled={loading}
                    >
                      Manage Billing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Comparison */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Lora, serif' }}>
            {hasSubscription ? 'Your Premium Benefits' : 'Choose Your Path'}
          </h2>
          <p className="text-xl text-slate-600">
            Start free. Upgrade when you're ready to go unlimited.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl scale-105 border-4 border-amber-400'
                  : 'bg-white border-2 border-slate-200 hover:border-slate-300 shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className={`text-lg ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                    /{plan.interval}
                  </span>
                </div>
                {plan.valueStatement && (
                  <p className="text-amber-300 font-semibold text-sm">{plan.valueStatement}</p>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-amber-400' : 'bg-emerald-100'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-slate-900' : 'text-emerald-600'}`} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                    <span className={`text-sm ${
                      feature.included
                        ? plan.popular
                          ? feature.highlight
                            ? 'text-amber-300 font-semibold'
                            : 'text-white'
                          : 'text-slate-900'
                        : 'text-slate-400 line-through'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => plan.id !== 'free' && handleSubscribe(plan.id)}
                disabled={loading || plan.id === 'free' || hasSubscription}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-600 cursor-default'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : hasSubscription && plan.popular ? 'Active' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Reversal Section */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Lora, serif' }}>
            Zero Risk. All Reward.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">30-Day Guarantee</h3>
              <p className="text-slate-400">
                Don't love it? Get every penny back. No questions asked.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cancel Anytime</h3>
              <p className="text-slate-400">
                No contracts. No commitments. Leave whenever you want.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Join the Movement</h3>
              <p className="text-slate-400">
                Believers transforming Bible reading into Bible living.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12" style={{ fontFamily: 'Lora, serif' }}>
          Common Questions
        </h2>

        <div className="space-y-4">
          <details className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-amber-400 transition-all duration-200 group">
            <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
              Can I really cancel anytime?
              <span className="text-amber-500 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-slate-600">
              Yes. Cancel with one click. You'll keep access until the end of your billing period. No hassle. No retention calls.
            </p>
          </details>

          <details className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-amber-400 transition-all duration-200 group">
            <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
              What if I don't like it?
              <span className="text-amber-500 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-slate-600">
              30-day money-back guarantee. If Premium doesn't accelerate your growth, email us. We'll refund you immediately.
            </p>
          </details>

          <details className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-amber-400 transition-all duration-200 group">
            <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
              What payment methods do you accept?
              <span className="text-amber-500 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-slate-600">
              All major credit cards. Processed securely through Stripe. We never see your card details.
            </p>
          </details>

          <details className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-amber-400 transition-all duration-200 group">
            <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
              Is the free tier really free forever?
              <span className="text-amber-500 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-slate-600">
              Yes. 10 verses total. Forever. No credit card required. Upgrade only when you want unlimited access.
            </p>
          </details>

          <details className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-amber-400 transition-all duration-200 group">
            <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
              How is this different from other Bible apps?
              <span className="text-amber-500 group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <p className="mt-4 text-slate-600">
              We focus on one thing: memorization that sticks. No distractions. No fluff. Just proven techniques that work.
            </p>
          </details>
        </div>
      </div>

      {/* Final CTA */}
      {!hasSubscription && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-400 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Ready to Transform Your Walk?
            </h2>
            <p className="text-xl text-slate-800 mb-8">
              Join believers memorizing Scripture that actually sticks.
            </p>
            <button
              onClick={() => handleSubscribe(PRICING_PLANS[1].id)}
              disabled={loading}
              className="px-12 py-5 bg-slate-900 text-white font-bold text-xl rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
            >
              {loading ? 'Processing...' : 'Get Pro for $9.99/mo'}
            </button>
            <p className="text-sm text-slate-700 mt-4">
              30-day money-back guarantee • Cancel anytime • No risk
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
