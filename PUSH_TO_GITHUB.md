# 🚀 Push Dubai Luxury Cars Project to **Soolking-cyber/swipe_app**

Follow these one-time steps to upload (or replace) the local **Dubai Luxury Cars** mono-repo to your GitHub repository **Soolking-cyber/swipe_app**.

---

## 1. Prerequisites
| Requirement | Check |
|-------------|-------|
| Git ≥ 2.30  | `git --version` |
| GitHub account with **write** access to `Soolking-cyber/swipe_app` | — |
| Local project folder named `dubai-luxury-cars/` (contains `client/`, `server/`, etc.) | — |
| **PAT** (Personal Access Token) or SSH key configured for your account | — |

---

## 2. Clone an *empty* working copy (optional)

If the repo already contains code you **want to replace**, back it up first!

```bash
# optional – see current state
git clone https://github.com/Soolking-cyber/swipe_app.git swipe_app_tmp
```

---

## 3. Initialise Git inside your local project

```bash
cd path/to/dubai-luxury-cars

# start repo & main branch (skip if repo already initialised)
git init -b main
```

### Add `.gitignore`

If you haven’t yet:

```bash
curl -sL https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore >> .gitignore
echo -e ".env*\nclient/build/\nserver/dist/\nuploads/" >> .gitignore
```

---

## 4. Add remote **swipe_app**

```bash
git remote add origin https://github.com/Soolking-cyber/swipe_app.git
# or SSH
# git remote add origin git@github.com:Soolking-cyber/swipe_app.git
```

If `origin` already exists but points elsewhere:

```bash
git remote set-url origin https://github.com/Soolking-cyber/swipe_app.git
```

---

## 5. First commit & push

```bash
git add .
git commit -m "feat: initial Dubai Luxury Cars full-stack project import"
```

### Push main branch

```bash
# HTTPS with PAT (recommended)
git push -u origin main
# → when prompted use PAT as password

# SSH users
# git push -u origin main
```

---

## 6. Verify on GitHub

1. Open `https://github.com/Soolking-cyber/swipe_app`
2. Check **main** branch files & commit message
3. Enable **branch protection** (Settings → Branches) if desired

---

## 7. Create dev branch (recommended workflow)

```bash
git checkout -b dev
git push -u origin dev
```

Future features:

```bash
git checkout -b feat/awesome-idea
# work, commit
git push -u origin feat/awesome-idea
# open Pull Request → dev
```

---

## 8. Dealing with large history or replacement

Need to *overwrite* remote history?

```bash
git push --force origin main
```

⚠️ **Force-push rewrites history**; ensure collaborators are informed.

---

## 9. Troubleshooting

| Error | Fix |
|-------|-----|
| `fatal: remote origin already exists` | `git remote set-url origin …` |
| Auth fails (HTTPS) | Generate PAT → GitHub → Settings → Developer settings → Tokens |
| Large files rejected | Use Git LFS or store assets in S3 / Cloudinary |

---

### 🎉 Your project is now live at `github.com/Soolking-cyber/swipe_app`!
