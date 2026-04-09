---
name: Stripe integration
description: Stripe subscription billing added to Flimo with Supabase quota tracking
type: project
---

Stripe + Supabase subscription system integrated into Flimo.

**Key files:**
- `lib/supabase.ts` — Supabase client (uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
- `lib/quota.ts` — checkQuota() / incrementGenerations() helpers used by all generate routes
- `app/api/stripe/create-checkout/route.ts` — Creates Stripe Checkout sessions
- `app/api/stripe/webhook/route.ts` — Handles checkout.session.completed, customer.subscription.deleted, invoice.paid
- `app/api/stripe/portal/route.ts` — Creates Stripe billing portal sessions
- `app/api/subscription/route.ts` — GET endpoint returning current user's plan + usage
- `app/tarifs/page.tsx` — Pricing page with 3 plans
- `app/dashboard/page.tsx` — Post-checkout success page

**Plans:** starter (70 gen), pro (150 gen), agence (999999 gen)

**Supabase schema:** `supabase/schema.sql` — includes subscriptions table + increment_generations RPC function

**Note:** Stripe v22 puts current_period_end on SubscriptionItem, not Subscription directly.

**Why:** Monetization via subscriptions with monthly generation quotas enforced server-side.

**How to apply:** All generate API routes check quota before calling Anthropic and increment after success. New env vars needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_STRIPE_*_PRICE_ID.
