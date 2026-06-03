# Contributing to @abapayway/node

Thank you for helping improve the ABAPayWay Node.js SDK.

## Development setup

```bash
git clone https://github.com/abapayway/node.git
cd node
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build ESM + CJS to `dist/` |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run lint` | Run Biome linter |
| `npm run test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage |

## Pull requests

1. Fork the repository and create a feature branch from `main`.
2. Add tests for new behavior.
3. Ensure `npm run typecheck`, `npm run lint`, and `npm run test:coverage` pass.
4. Update `CHANGELOG.md` under **Unreleased** if the change is user-facing.
5. Open a PR using the provided template.

## Code style

- TypeScript strict mode
- Named exports only (no default exports)
- JSDoc on all public APIs
- Match existing module patterns in `src/modules/`

## Reporting issues

Use the GitHub issue templates for bugs and feature requests. Include your SDK version, Node.js version, and whether you are on sandbox or production.
