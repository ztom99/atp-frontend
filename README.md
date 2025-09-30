# atp-frontend

This repository contains the frontend for an Automatic Test Platform (ATP) adapted from the open-source Hoppscotch project. The frontend has been selectively taken from Hoppscotch and modified to fit ATP requirements; the backend is NOT included.

## Key points

- This is a work-in-progress frontend based on Hoppscotch.
- Only the frontend part of Hoppscotch is used and adapted here; the backend has been fully re-implemented in Java + MySQL (replacing the original TypeScript + PostgreSQL) and is maintained separately.
- The frontend UI and some interactions have been modified to suit the automatic testing platform use cases.

## Quick start

### 1. Install dependencies:

pnpm install

### 2. Run a development server (example for the web package):

cd packages/hoppscotch-selfhost-web
pnpm run dev

### 3. Build:

cd packages/hoppscotch-selfhost-web
pnpm run build

## Configuration

- Copy or create a .env file in the project root (see existing .env for examples).
- Important environment variables you may need to configure:
  - VITE_BACKEND_API_URL — base URL for backend REST API
  - VITE_BACKEND_GQL_URL / VITE_BACKEND_WS_URL — GraphQL endpoints (if used)
  - VITE_ENCRYPT_KEY / VITE_ENCRYPT_IV — symmetric key/IV used by frontend encryption utilities

## Project layout (high level)

- packages/hoppscotch-common — shared components, utilities, and localization
- packages/hoppscotch-selfhost-web — main frontend site (vite)
- other packages — tooling, CLI, sandbox and supporting modules

## Notes

- The Java + MySQL backend is required for full functionality; ensure the backend APIs are available and match the frontend env configuration.
- This repository is under active development — behavior and features may change.

## Developer setup

If you need more detailed developer setup, deployment instructions, or CONTRIBUTING guidelines, request an update and those can be added.
