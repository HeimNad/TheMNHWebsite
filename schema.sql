-- Initialize database schema for The MNH Wonder Rides application

-- 1. Table: waivers
-- Used to store liability waiver submissions
CREATE TABLE IF NOT EXISTS waivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  child_name TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  signature_data JSONB NOT NULL
);

-- Evidentiary fields: what was agreed to, and from where. Defaulted so this
-- is safe to re-run against a database that already has waiver rows.
ALTER TABLE waivers ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE waivers ADD COLUMN IF NOT EXISTS age_confirmed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE waivers ADD COLUMN IF NOT EXISTS waiver_text TEXT NOT NULL DEFAULT '';
ALTER TABLE waivers ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE waivers ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Backfill for rows submitted before these columns existed. This is not
-- guesswork: the public waiver form has required both checkboxes to be
-- checked (client-side zod validation) since the very first commit, so
-- every pre-existing row was, in fact, submitted with both accepted.
-- waiver_text/ip_address/user_agent were never captured for these rows and
-- are left NULL/empty rather than backfilled with invented values.
-- Must run before the immutability trigger below, or it blocks itself.
UPDATE waivers SET terms_accepted = TRUE, age_confirmed = TRUE
  WHERE terms_accepted = FALSE AND age_confirmed = FALSE;

-- Waivers are legal evidence: block UPDATE/DELETE at the database engine
-- level so a signed record can never be silently altered after the fact,
-- regardless of which role or app code is connecting.
CREATE OR REPLACE FUNCTION prevent_waiver_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'waivers records are immutable and cannot be updated or deleted';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS waivers_immutable ON waivers;
CREATE TRIGGER waivers_immutable
  BEFORE UPDATE OR DELETE ON waivers
  FOR EACH ROW EXECUTE FUNCTION prevent_waiver_mutation();

-- 2. Table: messages
-- Used to store contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  child_age TEXT,
  preferred_contact TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'ignored', 'replied'))
);

-- 3. Table: announcements
-- Used to store site-wide announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Table: punch_cards
-- Used to store information about pre-paid punch cards
-- Supports both anonymous usage (card only) and membership usage (linked by phone)
CREATE TABLE IF NOT EXISTS punch_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,       -- The physical card number (e.g. '8823')
  balance INTEGER NOT NULL DEFAULT 0, -- Current remaining rides
  initial_punches INTEGER NOT NULL,   -- How many rides it started with (e.g. 6 or 13)
  card_type TEXT NOT NULL,         -- '5_plus_1', '10_plus_3', etc.
  
  -- Customer Info (Optional/Nullable)
  customer_name TEXT,              -- Parent's name
  customer_phone TEXT,             -- Main identifier for membership lookup
  customer_email TEXT,             -- For receipts/marketing
  child_name TEXT,                 -- For personalization
  child_birth_month TEXT,          -- MM/DD or just Month for birthday marketing
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'void')),
  notes TEXT,                      -- Staff notes (e.g. "Grandma brings him")
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_used_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_punch_cards_code ON punch_cards(code);
CREATE INDEX IF NOT EXISTS idx_punch_cards_phone ON punch_cards(customer_phone);

-- 5. Table: audit_logs
-- Used to track staff actions (ISSUE, REDEEM, VOID, UPDATE) for accountability
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL, -- Operator's name or email
  target_id UUID NOT NULL, -- Reference to the punch_card id
  details JSONB, -- Optional additional details
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON audit_logs(target_id);

-- 6. Table: bookings
-- Used to manage party reservations (calendar events)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  child_name TEXT,
  child_age TEXT,
  package_type TEXT, -- e.g. 'Weekday Package', 'Weekend Package'
  deposit_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- 7. Table: settings
-- Used to store global app configurations (e.g. business hours)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, -- e.g. 'business_hours'
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
