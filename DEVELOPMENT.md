## 📦 Installation Guide

This project is managed with [uv](https://github.com/astral-sh/uv).

Install/Upgrade dependencies:

```bash
npm install
```

Clean up:

```bash
npm run clean
```

Generate translations:

```bash
npm run manage-translations
```

## 🚀 Run Service Locally & Debug

Run the application:

```bash
npm run dev
```

## ✅ Running Unit Tests

Log in gchr:

```bash
echo "your PAT password" | docker login ghcr.io -u "your username" --password-stdin
docker pull --platform <platform> ghcr.io/omnsight/<image>:main
docker tag ghcr.io/omnsight/<image>:main <image>:latest
```

Run the application:

```bash
docker-compose up -d --wait
docker compose down
# arango db dashboard can be accessed at http://localhost:8529
```

Debug:

```bash
docker system prune -a
docker inspect <container name>
docker logs <container name>
```

```bash
npx playwright test
```

## 💅 Formatting Code

Format the code using black:

```bash
npm run lint
```

## Deploy To Production

```bash
npm run build
```
