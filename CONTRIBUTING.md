# Contributing

Thanks for helping with Deployard. This guide covers local setup, branches, commits, and pull requests.

## Prerequisites

- Docker Desktop (running)
- Node.js 20+, pnpm 9
- kind and kubectl (`make install-tools`)

Check tooling:

```bash
make doctor
```

## Local setup

```bash
cp .env.example .env
pnpm install
make cluster-up
make seed-demo
make docker-up
```

UI: http://localhost:18480 (port from `WEB_PORT` in `.env`).

Host-mode API + Vite (Postgres in Docker):

```bash
make docker-postgres-up
pnpm dev
```

## Branch and commits

1. Branch from `main`: `feat/...`, `fix/...`, `docs/...`, `chore/...`
2. Use [Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`
3. Keep commits focused. One concern per commit when practical.

## Pull requests

Use the PR template. Before opening:

```bash
make lint
make test
```

If you change Kubernetes or Docker paths, also run what applies:

```bash
make test-integration
make test-e2e
make helm-lint
```

## Code style

- TypeScript strict, ESLint + Prettier as configured in the repo
- No comments in code or configs
- Small files: one responsibility per module (see `docs/repository-structure.md`)
- UI strings only through i18next; update **all** locales under `apps/web/public/locales/` when text changes
- Bump `backend.queryStringParams.v` in `apps/web/src/i18n.ts` after locale edits

## Releases

Maintainers cut releases from `main`:

1. Update `CHANGELOG.md` and package / chart versions
2. Merge to `main`
3. Tag `vX.Y.Z` and push the tag (GitHub Release is created by CI)

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
