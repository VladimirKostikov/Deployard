# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Deployment list search by name, image, namespace, or warning reason
- Probe badges on deployment list and overview (liveness / readiness / startup)
- Recent Kubernetes events on deployment detail (`GET /deployments/:name/events`)
- Latest warning reason on deployment list rows when present
- Copy actions for image, pod name, and kubectl describe hint

## [0.1.0] - 2026-08-07

### Added

- Monorepo: `@dpd/api`, `@dpd/web`, `@dpd/shared` (pnpm workspaces)
- NestJS Kubernetes proxy API with OpenAPI, JWT sessions, section RBAC
- React UI: deployments, revision history, rollout undo, scale, restart
- Pod live status, log tail (SSE), exec console, file browser
- Docker Compose import with preview, build, kind load, and apply
- Services, endpoints, ingress, and in-browser port-forward
- Admin: users, roles, view / operate / manage permissions
- Prometheus metrics, health and readiness endpoints
- 28 UI languages via i18next
- Local kind workflow, demo-shop seed, Docker Compose stack
- Helm chart `deploy/helm/dpd` for cluster installs
- CI: lint, unit tests, integration (kind), Playwright e2e, Helm lint
- Deploy webhook workflow for image updates
- Community files: LICENSE (MIT), SECURITY, PR template

### Fixed

- CI builds `@dpd/shared` before lint and tests
- CI skips Postgres migration tests in the build job without a database

[Unreleased]: https://github.com/VladimirKostikov/Deployard/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/VladimirKostikov/Deployard/releases/tag/v0.1.0
