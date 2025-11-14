# Complete Stripe Subscription Setup Guide

This guide walks you through setting up Stripe subscriptions for your Bible memory application.

## Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Creating Subscription Plans](#creating-subscription-plans)
4. [Testing](#testing)
5. [Deployment](#deployment)

---

## Backend Setup

### 1. Install Dependencies

In your backend repository (`back/`):

```bash
npm install stripe
```

### 2. Environment Variables

Add these to your backend `.env` file:

```env
# Stripe Keys (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Webhook Secret (Get after creating webhook endpoint)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
# For production:
# FRONTEND_URL=https://lamptomyfeet.co
```

### 3. Add Backend Routes

See the file `STRIPE_BACKEND_SETUP.md` for the complete backend implementation.

Key steps:
1. Create `/back/routes/stripe.js` with all the Stripe endpoints
2. Register the routes in your `server.js`
3. Set up webhook endpoint

---

## Frontend Setup

### 1. Install Dependencies

Already done! ✓ The `@stripe/stripe-js` package has been installed.

### 2. Update Price IDs

Open `/home/user/front/src/pages/Subscriptions.tsx` and update the `PRICING_PLANS` array with your actual Stripe Price IDs:

```typescript
const PRICING_PLANS = [
  {
    id: 'price_1234567890abcdef', // ← Replace with your actual Stripe Price ID
    name: 'Basic Plan',
    price: 9.99,
    interval: 'month',
    features: [
      // ... your features
    ],
  },
  // ... more plans
];
```

### 3. No Frontend Environment Variables Needed

The frontend automatically uses:
- **Production**: `https://api.lamptomyfeet.co`
- **Development**: `http://localhost:3001`

The Stripe publishable key is fetched from the backend API, so you don't need to configure it in the frontend.

---

## Creating Subscription Plans

### 1. Create Products in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/products
2. Click **"Add product"**
3. Fill in the details:
   - **Name**: e.g., "Basic Plan"
   - **Description**: Description of the plan
   - **Pricing**: Set up recurring pricing (e.g., $9.99/month)
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)

### 2. Recommended Plans

Here's a suggested pricing structure:

#### Basic Plan - $9.99/month
- Access to all Bible verses
- Basic memorization tools
- Progress tracking
- Mobile app access

#### Pro Plan - $19.99/month (Most Popular)
- Everything in Basic
- Advanced learning techniques
- Custom verse collections
- Priority support
- Ad-free experience

#### Premium Plan - $29.99/month
- Everything in Pro
- Personal coaching sessions
- Exclusive content
- Early access to new features
- Lifetime updates

### 3. Update Frontend with Price IDs

After creating your products in Stripe, update the `PRICING_PLANS` in `/home/user/front/src/pages/Subscriptions.tsx` with the actual Price IDs.

---

## Testing

### 1. Test Cards

Use these test card numbers in Stripe Checkout:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

- **Expiry Date**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### 2. Test Webhooks Locally

Install the Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

This will give you a webhook signing secret. Add it to your backend `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Test the Flow

1. Start your backend: `cd back && npm run dev`
2. Start your frontend: `cd front && npm run dev`
3. Navigate to http://localhost:5173/subscriptions
4. Click "Subscribe Now" on any plan
5. Use test card `4242 4242 4242 4242`
6. Complete the checkout
7. Verify you're redirected back with success message
8. Check that the subscription appears in "Your Active Subscriptions"

---

## Setting Up Webhooks

### 1. Create Webhook Endpoint

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter your endpoint URL:
   - Development: Use Stripe CLI (see Testing section)
   - Production: `https://api.lamptomyfeet.co/api/stripe/webhook`

### 2. Select Events

Select these events to listen to:
- ✓ `customer.subscription.created`
- ✓ `customer.subscription.updated`
- ✓ `customer.subscription.deleted`
- ✓ `invoice.paid`
- ✓ `invoice.payment_failed`

### 3. Get Signing Secret

After creating the webhook:
1. Click on your webhook endpoint
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to your backend `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Deployment

### 1. Backend Environment Variables

Set these environment variables in your Railway backend:

```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
FRONTEND_URL=https://lamptomyfeet.co
```

⚠️ **Important**: Use **live mode** keys for production, not test mode keys!

### 2. Create Production Webhook

1. Go to https://dashboard.stripe.com/webhooks (make sure you're in LIVE mode, not test mode)
2. Create a new webhook endpoint with URL: `https://api.lamptomyfeet.co/api/stripe/webhook`
3. Select the same events as before
4. Copy the production webhook signing secret to your Railway environment variables

### 3. Create Live Products

1. Switch to **Live mode** in Stripe Dashboard (toggle in top left)
2. Create your products and pricing again (test mode products won't carry over)
3. Copy the live Price IDs
4. Update the `PRICING_PLANS` in your frontend code with the live Price IDs

### 4. Deploy

1. **Backend**: Push to your backend repository (should auto-deploy on Railway)
2. **Frontend**: The changes are already in this repository, just commit and push

---

## Optional: Database Integration

If you want to store subscription data in your MySQL database:

### Create Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50),
  plan_name VARCHAR(100),
  plan_amount DECIMAL(10, 2),
  plan_interval VARCHAR(20),
  current_period_end DATETIME,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_subscription (stripe_subscription_id)
);
```

### Update Webhook Handler

In your `back/routes/stripe.js`, update the webhook switch statement to save data to the database:

```javascript
case 'customer.subscription.created':
  const subscriptionCreated = event.data.object;
  // Save to database
  await db.query(
    'INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status, plan_name, current_period_end) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, subscriptionCreated.customer, subscriptionCreated.id, subscriptionCreated.status, planName, new Date(subscriptionCreated.current_period_end * 1000)]
  );
  break;
```

---

## Features Included

### ✓ Customer Portal
Users can:
- Update payment methods
- View billing history
- Download invoices
- Update billing information
- Cancel subscriptions

Access via the "Manage Billing" button.

### ✓ Subscription Management
Users can:
- Subscribe to plans
- Cancel subscriptions (with access until period end)
- Resume canceled subscriptions
- View active subscriptions
- See next billing date

### ✓ Pricing Plans Page
Features:
- Three tier pricing display
- Popular plan highlighting
- Feature comparison
- FAQ section
- Success/error notifications
- Mobile responsive design

---

## Customization

### Change Pricing Plans

Edit `/home/user/front/src/pages/Subscriptions.tsx`:

```typescript
const PRICING_PLANS = [
  {
    id: 'price_xxxxx', // Your Stripe Price ID
    name: 'Your Plan Name',
    price: 19.99,
    interval: 'month', // or 'year'
    features: [
      'Feature 1',
      'Feature 2',
      // ...
    ],
    popular: true, // Highlight this plan
  },
];
```

### Styling

The Subscriptions page uses Bootstrap 5 classes. You can:
- Modify the card styles
- Change button colors
- Update the FAQ section
- Add your own branding

The page is located at: `/home/user/front/src/pages/Subscriptions.tsx`

---

## Troubleshooting

### Issue: "Failed to load Stripe"
**Solution**: Make sure your backend is running and the `/api/stripe/config` endpoint is accessible.

### Issue: Webhook signature verification failed
**Solution**:
1. Make sure `STRIPE_WEBHOOK_SECRET` is set correctly in your backend `.env`
2. For local development, use Stripe CLI to forward webhooks
3. For production, create a webhook endpoint in Stripe Dashboard

### Issue: Subscriptions not showing up
**Solution**:
1. Check that the user email matches between your app and Stripe
2. Verify the webhook is receiving events (check Stripe Dashboard > Webhooks)
3. Check backend logs for errors

### Issue: Redirect after checkout not working
**Solution**:
1. Verify `FRONTEND_URL` is set correctly in backend `.env`
2. Check CORS settings in your backend
3. Make sure success/cancel URLs are properly configured in checkout session

---

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe API Reference**: https://stripe.com/docs/api

For issues with the implementation, check:
1. Browser console for frontend errors
2. Backend logs for API errors
3. Stripe Dashboard > Logs for webhook errors

---

## Security Checklist

Before going live:

- [ ] Use live Stripe keys (not test keys)
- [ ] Keep secret keys secure (never commit to git)
- [ ] Set up webhook signature verification
- [ ] Use HTTPS for all endpoints
- [ ] Configure CORS properly
- [ ] Validate all user inputs
- [ ] Test subscription flows thoroughly
- [ ] Set up error logging
- [ ] Test webhook handling
- [ ] Have a plan for failed payments

---

## Next Steps

1. **Set up Stripe account** (if you haven't already)
2. **Create products** in Stripe Dashboard
3. **Update Price IDs** in the frontend code
4. **Add backend code** from `STRIPE_BACKEND_SETUP.md`
5. **Test locally** with test cards
6. **Set up webhooks** in Stripe Dashboard
7. **Deploy to production** with live keys
8. **(Optional) Add database tracking** for subscriptions

You're all set! The Subscriptions page is now accessible at `/subscriptions` with the navigation link in the navbar.
