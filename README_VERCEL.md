Deployment notes — Vercel compatibility

This project contains a Vite React frontend and an Express backend (in `backend/`). By default the backend is a standalone Express server; Vercel does not host long-running Express servers directly, but you have two deployment options:

1) Single Vercel project (recommended for quick setup):
   - Convert the backend to Vercel Serverless Functions under the `api/` directory in the root of the frontend project. Each Express route becomes a serverless function, or you can wrap the whole Express app with `serverless-http` and export a handler.
   - Key steps:
     - Extract the Express `app` from `backend/src/server.js` so it does not call `app.listen()` directly; instead export it.
     - Add a new `api/index.js` in the frontend root that wraps the exported `app` using `serverless-http`:

       ```js
       const serverless = require('serverless-http');
       const app = require('../../backend/src/server-app'); // refactored file that exports the express app
       module.exports = serverless(app);
       ```

     - Ensure MongoDB connection is established on each function invocation or cached (use a global to cache the connection).
     - Set environment variables in the Vercel dashboard: `MONGO_URI`, `JWT_SECRET`, `SMTP_*`, etc.
     - Set `TRUST_PROXY=1` in production so cookies marked `Secure` work behind Vercel's proxy.

2) Two-tier deployment (frontend on Vercel, backend on a Node host):
   - Deploy the frontend to Vercel as-is.
   - Deploy the backend to a Node-hosting service (Render, Fly, Heroku, Railway, etc.).
   - Configure `FRONTEND_URL` in backend env and your frontend to call the backend URL (or use Vite proxy for local dev).
   - Ensure `CORS` is configured: the backend now reads `FRONTEND_URL` and will enable credentials when set.

Notes about the authentication fixes I implemented locally
- The backend now returns `token` in the JSON response for `signup`, `login`, and `refresh`. This matches the frontend which stores `sm_token` in `localStorage`.
- Cookie options are now environment-aware (sets `sameSite: 'none'` and `secure: true` in production, and `trust proxy` can be enabled by setting `TRUST_PROXY=1`).

If you want, I can:
- Refactor `backend/src/server.js` to export the `app` (no `app.listen`) and create an `api/` wrapper using `serverless-http` so the whole backend can run on Vercel with minimal changes.
- Or I can implement a smaller set of serverless functions (e.g., `api/auth/*`) to host only auth on Vercel and keep the rest of the backend as-is.

Which option would you like me to implement next? I can proceed to refactor and scaffold `api/index.js` + connection caching and a minimal example `api/auth/login.js` to demonstrate login on Vercel.
