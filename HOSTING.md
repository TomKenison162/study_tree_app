# Study Tree — Running & Hosting

## Run locally (development)

```bash
# Install all dependencies (first time only):
npm run install:all

# Start both frontend + backend:
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Build for production

```bash
npm run build          # builds client to client/dist/
npm start              # starts Express (serves API + static files on port 3001)
```

Open http://localhost:3001

## Deploy to Railway (recommended — free tier)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo
4. Set **Root Directory** = `/` and **Start command** = `npm start`
5. Add env vars:
   - `JWT_SECRET` = any long random string
   - `PORT` = `3001` (Railway sets this automatically)
6. Done — Railway builds and deploys automatically

## Deploy to Render

1. Push to GitHub
2. New Web Service at [render.com](https://render.com)
3. Build command: `npm run install:all && npm run build`
4. Start command: `npm start`
5. Set `JWT_SECRET` environment variable

## Environment variables

| Variable     | Default                          | Required in prod |
|-------------|----------------------------------|-----------------|
| `JWT_SECRET` | `study-tree-dev-secret-...`      | **Yes** — change this |
| `PORT`       | `3001`                           | Optional         |

## Database

Sessions and users are stored in `server/data.db` (SQLite file).
Add `server/data.db` to your Railway/Render persistent disk or volume to retain data across deploys.
