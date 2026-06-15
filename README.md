# Minta Salon MVP

A production-ready Full-Stack application built for a modern salon MVP. This project features a React (Vite) frontend and a Node.js (Express) backend powered by Prisma ORM and PostgreSQL (NeonDB).

## 🏗 Project Structure

This is a monorepo setup containing both the frontend and backend. For production, the entire application is bundled into a **Single Unified Docker Container** where the Node.js backend serves the compiled React frontend.

```
minta-salon-local/
├── Dockerfile                # Multi-stage Docker build for the unified app
├── README.md                 # This documentation
├── backend/                  # Node.js API Server
│   ├── prisma/               # Database schema & seed data
│   └── src/                  # Express routes, controllers, and services
└── frontend/                 # React SPA (Vite)
    └── src/                  # React components, pages, and contexts
```

## ⚙️ Functioning & Architecture

- **Frontend**: Built with React, Vite, and Tailwind CSS. It handles authentication and booking forms securely. API calls are made to relative `/api/*` endpoints.
- **Backend**: Built with Node.js and Express. It provides a RESTful API (`/api`) and simultaneously serves the static `dist/` frontend files.
- **Database**: Remote PostgreSQL (e.g., NeonDB) tracks `Users`, `Services`, and `Appointments`.

---

## 🚀 Local Development Guide

### 1. Database Setup
Create a `.env` file in the `backend/` directory with your NeonDB connection:
```env
DATABASE_URL="postgresql://username:password@ep-cool-db-1234.us-east-2.aws.neon.tech/minta_salon?sslmode=require"
JWT_SECRET="your_secret_key"
PORT=5000
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db push      # Push the schema to NeonDB
npx prisma generate     # Generate the Prisma client
npm run dev             # Start the server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Start the Vite server
```

---

## 🐳 VPS Production Deployment (Docker + NGINX)

We utilize a **Single Docker Container** approach. The container runs on port `5000` locally on your VPS, and you will use your host NGINX to reverse proxy a public domain to this container.

### Step 1: Build and Run the Docker Container

On your VPS, navigate to the root directory and build the Docker image:

```bash
docker build -t minta-salon-app .
```

Run the container, connecting it to your NeonDB and exposing port 5000 to the VPS localhost:

```bash
docker run -d \
  --name minta-salon \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://<your_neon_user>:<your_neon_pass>@<your_neon_host>/minta_salon?sslmode=require" \
  -e JWT_SECRET="your_production_secret" \
  -e PORT=5000 \
  -e NODE_ENV=production \
  --restart always \
  minta-salon-app
```

### Step 2: Configure VPS NGINX

Since you already host multiple apps on your VPS using NGINX (`sites-available/default`), add the following server block for Minta Salon.

Create a new file `/etc/nginx/sites-available/minta-salon`:

```nginx
server {
    # Replace with your actual domain for the salon
    server_name salon.mintafresh.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 80;
    
    # If you have SSL configured via Certbot, uncomment below:
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/salon.mintafresh.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/salon.mintafresh.com/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

Enable the site and restart NGINX:
```bash
ln -s /etc/nginx/sites-available/minta-salon /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Now, your unified React + Node.js container is live on your VPS, communicating directly with your NeonDB!





