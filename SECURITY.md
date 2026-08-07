# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x   | Yes       |
| 0.0.x   | No        |

## Reporting a vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Prefer a private report via [GitHub Security Advisories](https://github.com/VladimirKostikov/Deployard/security/advisories/new).

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Scope

In scope:

- `@dpd/api` Kubernetes API proxy and RBAC boundaries
- Authentication and authorization (JWT sessions, section RBAC, deploy webhook)
- Log streaming, deployment rollback, and pod exec endpoints
- Compose import path allowlist and file discovery roots

Out of scope:

- Vulnerabilities in third-party dependencies (report upstream)
- Misconfigured cluster RBAC outside this application
