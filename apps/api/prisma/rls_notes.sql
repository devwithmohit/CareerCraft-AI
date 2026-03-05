-- NOTE: The authenticated-role policies exist but auth.jwt() is not
-- populated since this project uses Kinde Auth (external JWT provider).
-- The service_role policies (used by Prisma) are fully active and grant
-- the API server complete access while blocking direct database connections.
-- When/if Supabase Auth is integrated in a future phase, the authenticated
-- policies will automatically activate without any SQL changes.

-- To verify directly in Supabase SQL Editor:
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
