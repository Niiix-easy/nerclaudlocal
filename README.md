# NeerCloud — Backend Cloud (BaaS)

NeerCloud é uma plataforma de Backend-as-a-Service própria, com PostgreSQL como
núcleo, seguindo a arquitetura descrita em `docs/ARCHITECTURE.md`.

> **Quer login social ou integrar com Lovable/bolt.new/GitHub?** Veja
> `docs/INTEGRATIONS.md` — login social, OAuth Apps e sync de migrations
> via GitHub.

> **Rodando em ZimaOS ou outro home server?** Siga `docs/ZIMAOS.md` — tem
> o passo a passo específico (IP da rede local, portas, perfis leves para
> hardware modesto).

Esta é a **Fase 1** (ver `docs/ROADMAP.md`): PostgreSQL + Project Manager +
API Gateway + REST API automática + Auth + RLS + Dashboard básico.

Em vez de reescrever PostgREST, GoTrue, Realtime etc. do zero, a Fase 1 usa
componentes open source consolidados por trás do gateway, e o "Control
Plane" (código próprio) é quem orquestra tudo — cria projetos, bancos,
usuários, políticas e domínios automaticamente.

## Stack (100% open source)

| Módulo               | Ferramenta                          |
|-----------------------|--------------------------------------|
| Banco de dados        | PostgreSQL 16                        |
| REST automático       | PostgREST                            |
| Auth (email/OAuth/JWT)| GoTrue (Supabase Auth)               |
| Autorização            | RLS nativo do PostgreSQL             |
| Gateway               | Kong Gateway                         |
| Realtime              | Supabase Realtime (Elixir/Phoenix)   |
| Storage               | MinIO (S3-compatible)                |
| Cache / filas leves   | Redis                                |
| Control Plane (custom)| NestJS + TypeScript                  |
| Dashboard (custom)    | Next.js + Tailwind + shadcn/ui       |
| SDK (custom)          | TypeScript (`@neer/sdk`)             |
| CLI (custom)          | Node.js (`neer`)                     |
| Observabilidade       | Prometheus + Grafana + Loki + Tempo  |
| Orquestração (Fase 4) | Docker Compose → Kubernetes          |

## Como subir o ambiente local

O stack usa `profiles` do Docker Compose. O profile `core` (Postgres, Auth,
REST, Gateway, Control Plane, Dashboard) já é um backend funcional
completo e é o que sobe por padrão via CLI.

**Opção 1 — via CLI (recomendado, equivalente a `supabase start`):**

```bash
cd cli && npm install && npm link   # instala o comando `neer` globalmente
cd ..
cp .env.example .env
neer start                          # sobe o profile "core"
neer start --profile core,storage   # core + storage, por exemplo
```

**Opção 2 — Docker Compose direto:**

```bash
cp .env.example .env
docker compose --profile core up -d
```

Profiles disponíveis: `core`, `storage`, `realtime`, `graphql`, `functions`, `cache`.

Para subir observabilidade junto (pesado — só recomendado com RAM sobrando):

```bash
docker compose -f docker-compose.yml -f observability/docker-compose.observability.yml --profile core up -d
```

Serviços expostos (padrão):

| Serviço | URL |
|---|---|
| Gateway (entrada única) | http://localhost:8000 |
| REST automático | http://localhost:8000/rest/v1 |
| GraphQL automático | http://localhost:8000/graphql/v1 |
| Auth | http://localhost:8000/auth/v1 |
| Realtime | ws://localhost:8000/realtime/v1 |
| Storage (via gateway) | http://localhost:8000/storage/v1 |
| Edge Functions | http://localhost:8000/functions/v1 |
| Control Plane (gerenciamento) | http://localhost:3001 |
| Dashboard (Studio) | http://localhost:3000 |
| Banco (acesso direto/debug) | localhost:5432 |
| Connection pooler (usar em apps) | localhost:6432 |
| MinIO Console | http://localhost:9001 |
| Grafana | http://localhost:3003 |
| Prometheus | http://localhost:9090 |

Gerar tipos TypeScript do schema atual:

```bash
neer gen types --out ./types/database.ts
```

Depois de subir o stack, valide rapidamente que tudo está de pé:

```bash
./scripts/smoke-test.sh
```

Ver `MODULES.md` para o mapeamento completo dos 14 módulos → pastas.

## Criando o primeiro projeto (fluxo do Control Plane)

```bash
curl -X POST http://localhost:3001/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "loja-xyz", "organizationId": "org_demo"}'
```

O Control Plane executa o pipeline descrito em `docs/ARCHITECTURE.md` §11:
cria schema isolado, roles do banco, políticas RLS padrão, secrets, registra
o projeto no Kong (rotas) e devolve as URLs da API.

## Estrutura do repositório

```
neercloud/
├── docker-compose.yml         # orquestra o stack principal
├── .env.example
├── MODULES.md                 # índice: módulo → pasta
├── services/
│   ├── postgres/init/         # 02 — bootstrap do banco (roles, RLS, schema platform)
│   ├── kong/kong.yml          # 03 — gateway (rotas de todos os módulos)
│   ├── control-plane/         # 01/02 — orgs, projetos, provisioning
│   ├── storage/                # 09 — buckets, signed URLs sobre MinIO
│   ├── functions/              # 10 — runtime Deno + funções de exemplo
│   ├── graphql/                 # 05 — PostGraphile (README/config)
│   └── dashboard/               # 11 — Studio (Next.js)
├── sdk/js/                    # 12 — @neer/sdk (rest, auth, storage, realtime)
├── cli/                       # 12 — neer-cli (project/db/functions/storage/secrets)
├── observability/              # 13 — Prometheus, Grafana, Loki, Tempo
├── infra/
│   ├── kubernetes/             # 14 — manifests para produção
│   └── terraform/              # 14 — provisionamento de infraestrutura
└── docs/
    ├── ARCHITECTURE.md         # arquitetura completa (14 módulos)
    └── ROADMAP.md              # fases 1 a 5
```

## Próximos passos (Fase 2+)

Ver `docs/ROADMAP.md`.
