# Minta Salon Backend API

Production-ready backend for Minta Salon — a salon booking and management platform.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** Zod

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env with your PostgreSQL connection string

# 3. Generate Prisma client & push schema to DB
npm run db:generate
npm run db:push

# 4. Seed the database
npm run db:seed

# 5. Start development server
npm run dev
```

### Test Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@mintasalon.com     | admin123    |
| Stylist  | priya@mintasalon.com     | stylist123  |
| Customer | rahul@example.com        | customer123 |

## API Endpoints

### Auth
| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /api/auth/register  | Register new user    | No   |
| POST   | /api/auth/login     | Login & get token    | No   |

### Users
| Method | Endpoint        | Description       | Auth     |
|--------|-----------------|-------------------|----------|
| GET    | /api/users/me   | Get my profile    | Required |
| PATCH  | /api/users/me   | Update my profile | Required |

### Services
| Method | Endpoint            | Description         | Auth       |
|--------|---------------------|---------------------|------------|
| GET    | /api/services       | List all services   | No         |
| GET    | /api/services/:id   | Get service details | No         |
| POST   | /api/services       | Create a service    | Admin only |
| PATCH  | /api/services/:id   | Update a service    | Admin only |
| DELETE | /api/services/:id   | Delete a service    | Admin only |

### Appointments
| Method | Endpoint                         | Description          | Auth     |
|--------|----------------------------------|----------------------|----------|
| POST   | /api/appointments                | Book appointment     | Required |
| GET    | /api/appointments                | List appointments    | Required |
| GET    | /api/appointments/:id            | Get appointment      | Required |
| PATCH  | /api/appointments/:id/status     | Update status        | Required |

### Health
| Method | Endpoint | Description        |
|--------|----------|--------------------|
| GET    | /health  | API health check   |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Database seed data
├── src/
│   ├── config/
│   │   ├── index.js         # App configuration
│   │   └── prisma.js        # Prisma client singleton
│   ├── controllers/         # HTTP request handlers
│   ├── middlewares/          # Auth, error handling, validation
│   ├── routes/              # Express route definitions
│   ├── services/            # Business logic layer
│   ├── utils/               # Helpers (JWT, password, errors)
│   ├── validators/          # Zod schemas
│   └── index.js             # App entry point
├── .env                     # Environment variables
└── package.json
```
