# Gift Card E-commerce Platform (Frontend)

**Version:** 1.0.0  
**Last updated:** 2025-01-02  
**Live demo:** https://sellcardojt.site/

A production-ready gift card e-commerce frontend built with React + TypeScript, designed to pair with a Spring Boot backend and AWS-hosted infrastructure. This repository contains the complete frontend application with all features implemented.

---

## Table of contents

- [Gift Card E-commerce Platform (Frontend)](#gift-card-e-commerce-platform-frontend)
  - [Table of contents](#table-of-contents)
  - [Quick summary](#quick-summary)
  - [Tech stack](#tech-stack)
  - [High-level features](#high-level-features)
    - [Customer-facing](#customer-facing)
    - [Admin-facing](#admin-facing)
    - [Cross-cutting](#cross-cutting)
  - [Prerequisites](#prerequisites)
  - [Local development — step by step](#local-development--step-by-step)
  - [Environment variables](#environment-variables)
  - [Project structure (concise)](#project-structure-concise)
  - [Build \& preview (production)](#build--preview-production)
    - [Build](#build)
    - [Preview production build](#preview-production-build)
  - [Deployment notes](#deployment-notes)
  - [Testing \& linting](#testing--linting)
    - [Lint](#lint)
    - [Type checking](#type-checking)
  - [Troubleshooting](#troubleshooting)
  - [Demo and architecture](#demo-and-architecture)
    - [Video demonstration](#video-demonstration)
    - [AWS Architecture diagram](#aws-architecture-diagram)
  - [](#)
  - [Contact](#contact)
  - [Changelog](#changelog)

---

## Quick summary

This repository is the frontend for the Gift Card E-commerce Platform. It is implemented with modern React (v18.x) + TypeScript and follows best practices for state management, server-state caching, internationalization, theming, and build performance.  
The frontend communicates with a JWT-secured Spring Boot backend. API documentation is located in the backend repository.

---

## Tech stack

- **Framework:** React 18 + TypeScript 5.x  
- **Bundler:** Vite 5 + SWC  
- **Routing:** React Router v6  
- **Client state:** Zustand  
- **Server state & caching:** TanStack React Query  
- **Styling:** Tailwind CSS (dark mode via class strategy)  
- **Forms:** React Hook Form  
- **HTTP client:** Axios (interceptors + JWT)  
- **Internationalization:** react-i18next + language detector (vi, en)  
- **Icons:** Lucide React

---

## High-level features

### Customer-facing

- Product catalog with filters and search  
- Product detail with variant selection  
- Cart management with recipient/message metadata  
- Checkout flow (protected route)  
- Order history and detailed order view  
- User profile editing + avatar upload  
- i18n with Vietnamese and English  
- Dark/light theme toggle (persisted)

### Admin-facing

- Product CRUD with image uploads  
- Variant management  
- Inventory and activation code management  
- Order management (status updates, refunds)  
- Revenue dashboard

### Cross-cutting

- JWT authentication with Axios interceptors  
- Toast-based error and success notifications  
- Optimistic updates and caching with React Query  
- Persistent state (auth/cart/theme) using Zustand + localStorage

---

## Prerequisites

- Node.js 18+  
- npm 9+  
- Git

---

## Local development — step by step

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment configuration**
Create .env.development in the project root.
See Environment variables for details.

4. **Create environment configuration**
```bash
npm run dev
```
The app runs on http://localhost:5173 by default.

4. **Create environment configuration**
Visit http://localhost:5173 (or whatever Vite prints).

## Environment variables

Create `.env.development`:

```env
VITE_API_BASE_URL=https://sell-card-ojt.onrender.com/api
```

Notes:

- All environment variables consumed by the client must start with VITE_.
- The Axios instance uses this value for request base URLs and JWT injection.
## Project structure (concise)

```text
src/
  api/               # axios config, API endpoints, service modules
  components/        # reusable UI (common/layout/features)
  pages/             # route-level customer/admin/auth pages
  store/             # Zustand stores (auth, cart, ui, theme)
  queries/           # React Query hooks
  i18n/              # translation files and configuration
  utils/             # helpers, validators, formatters
  styles/            # Tailwind base styles
  App.tsx            # root component
  main.tsx           # application entry (providers, routing)
```

Configuration files:

- vite.config.ts  
- tsconfig.json  
- tailwind.config.ts  
- .env.* files

---

## Build & preview (production)

### Build

```bash
npm run build
```

Build artifacts generated to `dist/`.

### Preview production build

```bash
npm run preview
```

Useful for testing routing and behavior before deployment.

---

## Deployment notes

- Output folder: `dist/`  
- Suitable for static hosting (S3 + CloudFront, Netlify, Vercel, etc.)  
- Ensure SPA routing fallback → always serve `index.html` for unknown routes  
- Backend must allow the production domain (`https://sellcardojt.site`) via CORS  

The project is already deployed at `https://sellcardojt.site/`.

---

## Testing & linting

### Lint

```bash
npm run lint
```

### Type checking

```bash
tsc --noEmit
```

No formal test suites are included by default.

---

## Troubleshooting

**Dev server fails to start**  
- Ensure Node.js version is supported.  
- Delete `node_modules` and reinstall dependencies.

**401 unauthorized errors**  
- Confirm your backend is running and `VITE_API_BASE_URL` is correct.  
- Login must successfully return a JWT.

**Missing translation keys**  
- Ensure the component loads the required i18n namespaces.  
- Validate locale JSON structure for typos.

---

## Demo and architecture

### Video demonstration  
[![Watch the Demo](https://img.youtube.com/vi/8K6pMkwGcOw/maxresdefault.jpg)](https://youtu.be/8K6pMkwGcOw)

### AWS Architecture diagram  
![Architecture](/src/assets/images/diagram.png)
---

## Contact

Frontend owner/maintainer: Repository owner  
Backend/API documentation: ![See backend repository]()

---

## Changelog

**1.0.0 (2025-01-02)**  
Initial stable release with full customer + admin features, i18n, dark mode, React Query integration, and complete client-side flows.