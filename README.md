# Symfony Project

## Overview
This repository contains a Symfony (PHP) project intended for team collaboration.

## Branching strategy
- `main`: stable / production
- `dev`: integration branch
- `feature/*`: one branch per feature/task
- `fix/*`: bug fixes
- `hotfix/*`: urgent production fixes (rare)

## How we work (PR flow)
1. Create a branch from `dev`
2. Commit your changes
3. Open a Pull Request into `dev`
4. Get approval(s)
5. Merge (no direct push to `main`/`dev`)

## Requirements
- PHP (version depends on your project)
- Composer
- (Optional) Symfony CLI

## Setup (local)
```bash
git clone https://github.com/<org-or-user>/<repo>.git
cd <repo>
composer install
```

### Environment
Copy or configure your environment variables as needed:
- `.env` is tracked
- use `.env.local` for your local overrides (ignored by Git)

## Run (dev)
If you use Symfony CLI:
```bash
symfony server:start
```

Or using PHP built-in server (if your project supports it):
```bash
php -S 127.0.0.1:8000 -t public
```

## Common commands
```bash
php bin/console about
php bin/console cache:clear
```

## Tests
> Add your test commands here once your test setup is ready (PHPUnit, etc.).
