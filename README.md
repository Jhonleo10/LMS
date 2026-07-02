# AIT Language Academy — Video LMS

Local learning platform for AIT Language Academy with admin publishing and student video access.

## Quick Start

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL)

```bash
npm install
cp .env.example .env    # skip if .env already exists
npm run db:up             # starts PostgreSQL in Docker
npm run setup             # creates tables + seeds demo users
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@example.com` | `admin123` | Manage users, publish videos |
| **Student** | `learner@example.com` | `learner123` | Watch published videos only |

Students can also **Register** at `/register` to create a new learner account.

## How It Works

1. **Admin** logs in → creates videos → clicks **Publish** to make them visible
2. **Students** register or log in → see only **published** videos in their library
3. Unpublished (draft) videos are hidden from all learners

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run db:up` | Start local PostgreSQL (Docker) |
| `npm run db:down` | Stop local PostgreSQL |
| `npm run setup` | Push schema and seed demo data |
| `npm run build` | Production build |
