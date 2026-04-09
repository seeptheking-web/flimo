-- Table des abonnements Flimo
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'agence')),
  generations_used INTEGER DEFAULT 0 NOT NULL,
  generations_limit INTEGER NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour les lookups par user_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Fonction atomique d'incrémentation des générations
CREATE OR REPLACE FUNCTION increment_generations(p_user_id TEXT)
RETURNS VOID AS $$
  UPDATE subscriptions
  SET generations_used = generations_used + 1
  WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS : activer la sécurité au niveau des lignes
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Les opérations via service_role byppassent automatiquement le RLS
