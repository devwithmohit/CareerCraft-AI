-- ============================================================
-- Row Level Security (RLS) — CareerCraft AI
-- Apply via Supabase SQL Editor or psql
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. ENABLE RLS ON ALL TABLES
-- ─────────────────────────────────────────────
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters      ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_preps    ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 2. DROP EXISTING POLICIES (idempotent re-run)
-- ─────────────────────────────────────────────
DO $$ DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'users','subscriptions','jobs','resumes','applications',
        'timeline_events','reminders','contacts','cover_letters','interview_preps'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────
-- 3. users — own row only
-- ─────────────────────────────────────────────
CREATE POLICY "users: service role full access"
  ON users FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "users: owner select"
  ON users FOR SELECT
  TO authenticated
  USING (kinde_id = auth.jwt() ->> 'sub'
         OR id = auth.uid()::text);

CREATE POLICY "users: owner update"
  ON users FOR UPDATE
  TO authenticated
  USING (kinde_id = auth.jwt() ->> 'sub'
         OR id = auth.uid()::text)
  WITH CHECK (kinde_id = auth.jwt() ->> 'sub'
              OR id = auth.uid()::text);

-- ─────────────────────────────────────────────
-- 4. Helper: resolve internal user id from JWT
-- ─────────────────────────────────────────────
-- NOTE: Prisma uses service_role connection → bypasses ALL RLS.
-- Policies below protect direct Supabase SDK / anon connections.

-- ─────────────────────────────────────────────
-- 5. subscriptions
-- ─────────────────────────────────────────────
CREATE POLICY "subscriptions: service role full access"
  ON subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "subscriptions: owner select"
  ON subscriptions FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 6. jobs
-- ─────────────────────────────────────────────
CREATE POLICY "jobs: service role full access"
  ON jobs FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "jobs: owner all"
  ON jobs FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 7. resumes
-- ─────────────────────────────────────────────
CREATE POLICY "resumes: service role full access"
  ON resumes FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "resumes: owner all"
  ON resumes FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 8. applications
-- ─────────────────────────────────────────────
CREATE POLICY "applications: service role full access"
  ON applications FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "applications: owner all"
  ON applications FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 9. timeline_events (via application ownership)
-- ─────────────────────────────────────────────
CREATE POLICY "timeline_events: service role full access"
  ON timeline_events FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "timeline_events: owner all"
  ON timeline_events FOR ALL TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  );

-- ─────────────────────────────────────────────
-- 10. reminders
-- ─────────────────────────────────────────────
CREATE POLICY "reminders: service role full access"
  ON reminders FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "reminders: owner all"
  ON reminders FOR ALL TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  );

-- ─────────────────────────────────────────────
-- 11. contacts
-- ─────────────────────────────────────────────
CREATE POLICY "contacts: service role full access"
  ON contacts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "contacts: owner all"
  ON contacts FOR ALL TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications
      WHERE user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub')
    )
  );

-- ─────────────────────────────────────────────
-- 12. cover_letters
-- ─────────────────────────────────────────────
CREATE POLICY "cover_letters: service role full access"
  ON cover_letters FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "cover_letters: owner all"
  ON cover_letters FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 13. interview_preps
-- ─────────────────────────────────────────────
CREATE POLICY "interview_preps: service role full access"
  ON interview_preps FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "interview_preps: owner all"
  ON interview_preps FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE kinde_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- 14. Verification query — check RLS status
-- ─────────────────────────────────────────────
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users','subscriptions','jobs','resumes','applications',
    'timeline_events','reminders','contacts','cover_letters','interview_preps'
  )
ORDER BY tablename;
