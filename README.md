<h1 align="center">Deployard</h1>

<p align="center">
  <strong>Kubernetes deployment control plane</strong>
</p>

<p align="center">
  <a href="https://github.com/VladimirKostikov/Deployard/actions/workflows/ci.yml"><img src="https://github.com/VladimirKostikov/Deployard/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/VladimirKostikov/Deployard/releases/latest"><img src="https://img.shields.io/github/v/release/VladimirKostikov/Deployard" alt="Release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="package.json"><img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg" alt="Node.js 20+" /></a>
</p>

<p align="center">
  Created for <strong>educational and portfolio purposes</strong>.<br/>
  Free to use, modify, and share under the <a href="LICENSE">MIT License</a>.
</p>

<p align="center">
  <sub>
    Explore deployments, rollbacks, pod status, and logs through a typed web UI<br/>
    instead of juggling kubectl, Compose, and one-off scripts.
  </sub>
</p>

<p align="center">
  <strong>English</strong> ·
  <a href="docs/readme/README.bg.md">Български</a> ·
  <a href="docs/readme/README.cs.md">Čeština</a> ·
  <a href="docs/readme/README.da.md">Dansk</a> ·
  <a href="docs/readme/README.de.md">Deutsch</a> ·
  <a href="docs/readme/README.el.md">Ελληνικά</a> ·
  <a href="docs/readme/README.es.md">Español</a> ·
  <a href="docs/readme/README.et.md">Eesti</a> ·
  <a href="docs/readme/README.fi.md">Suomi</a> ·
  <a href="docs/readme/README.fr.md">Français</a> ·
  <a href="docs/readme/README.ga.md">Gaeilge</a> ·
  <a href="docs/readme/README.hr.md">Hrvatski</a> ·
  <a href="docs/readme/README.hu.md">Magyar</a> ·
  <a href="docs/readme/README.is.md">Íslenska</a> ·
  <a href="docs/readme/README.it.md">Italiano</a> ·
  <a href="docs/readme/README.lt.md">Lietuvių</a> ·
  <a href="docs/readme/README.lv.md">Latviešu</a> ·
  <a href="docs/readme/README.mt.md">Malti</a> ·
  <a href="docs/readme/README.nl.md">Nederlands</a> ·
  <a href="docs/readme/README.no.md">Norsk</a> ·
  <a href="docs/readme/README.pl.md">Polski</a> ·
  <a href="docs/readme/README.pt.md">Português</a> ·
  <a href="docs/readme/README.ro.md">Română</a> ·
  <a href="docs/readme/README.ru.md">Русский</a> ·
  <a href="docs/readme/README.sk.md">Slovenčina</a> ·
  <a href="docs/readme/README.sl.md">Slovenščina</a> ·
  <a href="docs/readme/README.sv.md">Svenska</a> ·
  <a href="docs/readme/README.uk.md">Українська</a>
</p>

<p align="center">
  <img src="docs/assets/screenshot.png" alt="Deployard deployments dashboard" width="720" />
</p>

## About

Deployard is a deployment control plane for Kubernetes. The web UI and typed API sit in front of the cluster so browsers and scripts never hit the API server directly.

### The problem

Cluster work usually means jumping between tools. `kubectl` for rollouts and pod status. Docker Compose for local builds. Shell scripts to load images into kind. Separate tabs for logs and port-forwards. Each tool has its own auth, output format, and failure modes. Small teams feel it quickly. Larger teams patch it with internal dashboards that are often read-only or locked to one environment.

Deployard focuses on the deployment lifecycle: what is running, which revision is live, pod health, rollbacks, log tailing, and getting a Compose project into the cluster without a manual checklist.

### What you get

| Area | What Deployard does |
|---|---|
| Deployments | List, detail, revision history, scale, disable, restart, rollout undo |
| Pods | Live status (watch), log tail over SSE, exec console, file browser |
| Import | Parse Compose, preview K8s manifests, build images, load into kind, apply |
| Network | Services, endpoints, ingress, in-browser access via controlled port-forward |
| Admin | Users, roles, section-based permissions (view / operate / manage) |
| Ops | Health and readiness probes, Prometheus metrics, structured logging |

The frontend never calls the Kubernetes API. The NestJS backend holds the kubeconfig, runs JWT sessions with token revocation in PostgreSQL, and exposes only whitelisted operations. Same pattern as behind an internal platform API.

### How it is built

pnpm monorepo: React and Vite on the frontend, NestJS with `@kubernetes/client-node` on the backend, shared DTOs in `@dpd/shared`, OpenAPI from controllers.

Local dev is set up like a small real environment:

- **kind** runs demo workloads (`demo-shop`) in the cluster
- **Docker Compose** runs Postgres, API, and nginx-served UI on one port
- **Helm chart** (`deploy/helm/dpd`) for production-style installs

Integration tests hit a live API against kind. Playwright covers login and the deployments flow. Design notes live in [ADRs](docs/adr/).

### Who this is for

The project is for learning and portfolio work. It shows Kubernetes beyond `kubectl apply`: rollouts, RBAC, streaming, observability, and shipping the stack with Docker, CI, and Helm. MIT license. Fork it, extend it, or reuse parts in your own UI.

Lens or Kubernetes Dashboard are enough if you only need a generic cluster explorer. Deployard goes deeper on deployments, operations, and the path from Compose to cluster.

## Features

- Deployment list, revision history, rollout undo
- Pod status with live updates, log tail (SSE), exec console
- Docker Compose import, rebuild, kind image load
- Services, endpoints, ingress, port-forward from the UI
- Roles and section-based access (view / operate / manage)
- Prometheus metrics for the API process
- 28 UI languages (i18next)

## Prerequisites

- Docker Desktop (running)
- [kind](https://kind.sigs.k8s.io/), `kubectl`
- Node.js 20+, [pnpm](https://pnpm.io/) 9

Check tooling:

```bash
make install-tools
make doctor
```

## Local setup

Full stack: **kind cluster** (demo workloads) + **Docker Compose** (Postgres, API, web UI).

```bash
cp .env.example .env
make cluster-up
make seed-demo
make docker-up
```

What each step does:

| Command | Action |
|---|---|
| `make cluster-up` | Creates kind cluster `dpd-local`, switches kubectl to `kind-dpd-local` |
| `make seed-demo` | Builds demo-shop images, loads them into kind, applies `demo/demo-shop/kubernetes` |
| `make docker-up` | Builds and starts Postgres, API, and web (nginx on port from `WEB_PORT`) |

Stop or reset:

```bash
make docker-down          # stop Compose stack
make cluster-down         # delete kind cluster
docker compose --env-file .env -f deploy/docker/compose.yml down -v   # wipe Postgres volume
```

## Local URLs

Default port is **18480** (`WEB_PORT` in `.env`).

| URL | What |
|---|---|
| http://localhost:18480 | Web UI (login) |
| http://localhost:18480/api/docs | OpenAPI (Swagger) |
| http://localhost:18480/api/health | API liveness |
| http://localhost:18480/api/health/ready | API + Kubernetes readiness |
| http://localhost:18480/api/metrics | Prometheus metrics (API) |
| http://localhost:30081 | demo-shop web (NodePort in kind, after `make seed-demo`) |
| postgresql://dpd:dpd@localhost:5432/dpd | Postgres (host access, from `.env`) |

Default dev users (seed only): `admin@dpd.local` / `Admin123!`, `user@dpd.local` / `User123!`

## Local development (without Docker UI)

API and web run on the host. Postgres can stay in Docker.

```bash
pnpm install
cp .env.example .env
make cluster-up
make seed-demo
make docker-postgres-up
pnpm dev
```

| URL | What |
|---|---|
| http://localhost:5173 | Web UI (Vite dev server) |
| http://localhost:3000/api | API |
| http://localhost:3000/api/docs | OpenAPI |

## Useful commands

```bash
make docker-logs          # follow API / web / Postgres logs
make lint                 # TypeScript lint (all packages)
make test                 # unit tests
make test-integration     # API + kind (API on :3000, Postgres required)
make test-e2e             # Playwright (web on :5173)
make helm-lint            # lint Helm chart
make helm-install         # install chart into kind (alternative to docker-up)
make cluster-down         # remove kind cluster
```

Rebuild after code changes:

```bash
make docker-up
```

## Production

See [docs/deploy.md](docs/deploy.md) for Helm, migrations, and `create-admin`.

```bash
pnpm --filter @dpd/api create-admin admin@example.com 'YourPassword'
```

## Examples

| Path | What it is |
|---|---|
| `demo/demo-shop` | Postgres + API + web, seeded into kind |
| `demo/weather-station` | Small compose stack for import practice |
| `demo/todo-board` | Minimal frontend + API sample |
| `examples/kubernetes/` | kind config, RBAC samples |

```bash
make demo-load
make seed-demo
```

## Stack

| Layer | Tech |
|---|---|
| Backend | NestJS, `@kubernetes/client-node`, Socket.IO, TypeORM |
| Frontend | React, Vite, TanStack Query, i18next |
| Data | PostgreSQL (users, roles) |
| Infra | Docker, kind, Helm, Prometheus |
| Monorepo | pnpm workspaces (`@dpd/api`, `@dpd/web`, `@dpd/shared`) |

## Architecture

```
React UI  →  NestJS API  →  Kubernetes API
                ↓
           PostgreSQL
```

The frontend never calls the cluster directly. The API enforces JWT auth with section-based permissions. The Kubernetes ServiceAccount uses least-privilege RBAC (see `examples/kubernetes/rbac.yaml`).

Details: [docs/architecture.md](docs/architecture.md) and [ADRs](docs/adr/)

## Documentation

| Doc | Topic |
|---|---|
| [Architecture](docs/architecture.md) | Design and phases |
| [Deploy](docs/deploy.md) | Helm, migrations, first admin |
| [Repository layout](docs/repository-structure.md) | Folder conventions |
| [Contributing](CONTRIBUTING.md) | Local setup, commits, PRs |
| [Security](SECURITY.md) | Report a vulnerability |
| [Changelog](CHANGELOG.md) | Release notes |

## License

[MIT](LICENSE). You may use, copy, modify, and distribute this project for any purpose, including commercial use, as long as the license notice is preserved.
