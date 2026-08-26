-- Create required roles for PostgREST
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'troque_esta_senha';
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;


-- Grant required permissions to roles
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;

-- Create auth schema


-- Configure database permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated;
