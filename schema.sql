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