# Contributing Guide

## Branching
- Do **not** push directly to `main` or `dev`.
- Create a branch per task:
  - `feature/<id>-<short-name>`
  - `fix/<id>-<short-name>`
  - `hotfix/<id>-<short-name>` (rare)

## Workflow
1. Pick an Issue (or create one)
2. Create your branch from `dev`
3. Commit small, clear changes
4. Open a Pull Request into `dev`
5. Request a review
6. Merge only when approved (and checks pass, if enabled)

## Commit messages
Use a simple convention:
- `feat: ...`
- `fix: ...`
- `docs: ...`
- `refactor: ...`
- `chore: ...`

## Coding standards
- Follow Symfony best practices
- Keep changes focused and easy to review
