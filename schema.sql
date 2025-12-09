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
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'ignored'))
);

-- Migration for existing deployments: Add 'subject' column to messages table
-- Run this if the 'messages' table already exists but lacks the 'subject' column.
ALTER TABLE messages ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'General Inquiry';
