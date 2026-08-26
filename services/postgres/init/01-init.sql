-- Create required roles for GoTrue and PostgREST
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'troque_esta_senha';
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE supabase_auth_admin NOINHERIT LOGIN PASSWORD 'troque_esta_senha';

-- Grant required permissions to roles
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION supabase_auth_admin;

-- Configure database permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated;
