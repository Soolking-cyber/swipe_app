# 📤 GitHub Setup Guide  
Upload & maintain the **Dubai Luxury Cars** full-stack project with confidence.

---

## 1. Prerequisites

| Tool / Account | Purpose | Docs |
|----------------|---------|------|
| **Git** (≥ 2.30) | Version-control CLI | <https://git-scm.com/> |
| **GitHub account** | Remote repo hosting | <https://github.com/> |
| (Optional) **GitHub CLI** | Easier auth/commands | <https://cli.github.com/> |

> Verify Git:  
> `git --version`

---

## 2. One-Time GitHub Preparation

1. Sign in to GitHub → **New repository**.  
2. Repository settings:  

   | Field | Recommended value |
   |-------|-------------------|
   | **Name** | `dubai-luxury-cars` |
   | **Visibility** | Private (switch to Public later) |
   | **Initialize** | _Leave unchecked_ (we’ll push an existing project) |
3. Click **Create repository**; copy the **origin URL** (e.g. `git@github.com:your-org/dubai-luxury-cars.git`).

---

## 3. Local Project – First Commit

```bash
# from the project root (where client/ & server/ folders live)
git init -b main           # create repo & main branch
git remote add origin <origin-URL>

# good .gitignore (Node, React, logs, env, Docker artifacts)
curl -sL https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore >> .gitignore
echo ".env*"              >> .gitignore
echo "uploads/"           >> .gitignore
echo "client/build/"      >> .gitignore
echo "server/dist/"       >> .gitignore

git add .
git commit -m "feat: initial luxury-car-rental monorepo (#1)"
git push -u origin main
```

### Why a single commit?
Keeping the first commit atomic lets collaborators clone/checkout a running project in one step.

---

## 4. Protect Sensitive Data

| File | Action |
|------|--------|
| `.env`, `.env.*` | **Do NOT commit**. Already ignored above. |
| `docker-compose.override.yml` | Keep secrets out or use `${VAR}` placeholders. |
| **GitHub Secrets** | Settings → Secrets → *Actions*. Add `MONGODB_URI`, `JWT_SECRET`, etc. |

---

## 5. Branching Workflow

| Branch | Purpose |
|--------|---------|
| **main** | Production-ready, always deployable |
| **dev**  | Integration of feature branches |
| `feat/*` | New features |
| `fix/*`  | Bug fixes |
| `docs/*` | Documentation updates |

```bash
git checkout -b feat/stripe-integration
# work …
git commit -m "feat: add Stripe payment stub"
git push --set-upstream origin feat/stripe-integration
# open Pull Request → dev → review → merge
```

Enable “Require PR review” & “Require status checks” in repo **Settings → Branches**.

---

## 6. GitHub Actions CI (optional but recommended)

1. In root, create `.github/workflows/ci.yml` with:
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 18
         - run: cd server && npm ci && npm run build && npm test
         - run: cd client && npm ci && npm run build --if-present
   ```
2. Push to trigger first build.

---

## 7. Handling Large Assets

* Keep **car images/videos** in S3 / Cloudinary; store only URLs in DB.
* If you _must_ track binaries: use [Git LFS](https://git-lfs.github.com/).

---

## 8. Tags & Releases

```bash
git tag -a v1.0.0 -m "MVP release"
git push origin v1.0.0
```
Then create a **GitHub Release** attaching changelog & Docker images.

---

## 9. Keeping Forks / Clones up-to-date

```bash
git pull --rebase origin main       # within feature branch
git push --force-with-lease         # after rebase
```

---

## 10. Common Pitfalls

| Issue | Fix |
|-------|-----|
| “fatal: remote origin already exists” | `git remote set-url origin <url>` |
| Accidentally committed secrets | Rotate secret, `git filter-repo` to purge history, force-push |
| Large node_modules push | Confirm `.gitignore` includes it; run `git rm -r --cached node_modules` |

---

## 11. Next Steps

1. Enable **Dependabot** & **CodeQL** in repo → Security.  
2. Configure **branch protection rules**.  
3. Integrate **Renovate** or **Dependabot** for dependency updates.  
4. Connect GitHub to your deployment platform (Render / Railway / ECS).

---

### ✅ You’re Live on GitHub!

Collaborators can now:

```bash
git clone git@github.com:your-org/dubai-luxury-cars.git
cd dubai-luxury-cars
npm run dev   # or docker-compose up
```

Happy coding – and enjoy the ride! 🚗💨
