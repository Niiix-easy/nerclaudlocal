-- 02-rls-setup.sql
-- Implementa isolamento rigoroso de Tenant/Organization utilizando RLS do PostgreSQL

-- 1. Cria a role de aplicação que NÃO DEVE ter SUPERUSER e não deve ignorar RLS (BYPASSRLS)
-- Esta role assumirá a identidade da requisição (ex: SET ROLE neer_app)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'neer_app') THEN
    CREATE ROLE neer_app NOLOGIN NOINHERIT;
  END IF;
END
$$;

-- 2. Concede as permissões mínimas (DML) para o app
GRANT USAGE ON SCHEMA public TO neer_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO neer_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO neer_app;

-- Opcionalmente: O catálogo pode ficar como apenas leitura
-- REVOKE INSERT, UPDATE, DELETE ON TABLE public."Product", public."Meter", public."Plan" FROM neer_app;

-- 3. Habilita RLS forçando o contexto da Organização
-- Assume que a aplicação Next/Nest vai rodar:
-- SET LOCAL app.current_tenant_id = 'org_xyz123';

-- Funções utilitárias para buscar o Tenant atual
CREATE OR REPLACE FUNCTION get_current_tenant() RETURNS text AS $$
  SELECT current_setting('app.current_tenant_id', true);
$$ LANGUAGE sql STABLE;

-- 4. Aplica Políticas RLS nas tabelas principais criadas via Prisma
-- (Requer que o schema prisma inicial já tenha rodado suas tabelas, ou isso deve vir num fluxo pós-prisma)
-- Como é um script de init, as tabelas podem ainda não existir, usaremos DO blocks defensivos

DO $$
DECLARE
    table_rec record;
    -- Tabelas que requerem isolamento obrigatório de tenant
    tenant_tables text[] := ARRAY['Project', 'Subscription', 'Invoice', 'Payment', 'AuditLog', 'WebhookEvent', 'UsageAggregate', 'ApiKey', 'Resource'];
    t text;
BEGIN
    FOR t IN SELECT unnest(tenant_tables) LOOP
        -- Se a tabela existir
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            -- Força ativação de RLS (Fail-closed se a RLS não der match)
            EXECUTE format('ALTER TABLE public."%I" ENABLE ROW LEVEL SECURITY', t);
            EXECUTE format('ALTER TABLE public."%I" FORCE ROW LEVEL SECURITY', t);

            -- Remove políticas antigas se existirem
            EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON public."%I"', t);

            -- Cria a política central: O app só pode ver/modificar se a coluna organizationId for igual ao tenant atual.
            -- Se não houver contexto (NULL), nenhuma linha é retornada (Fail-closed).
            EXECUTE format('CREATE POLICY tenant_isolation_policy ON public."%I" FOR ALL TO neer_app USING ("organizationId" = get_current_tenant() AND get_current_tenant() IS NOT NULL)', t);
        END IF;
    END LOOP;
END
$$;
