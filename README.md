# Flux Ticker

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rziman/flux-ticker-realtime-multi-source-crypto-stream)

A full-stack application powered by Cloudflare Workers, featuring a modern React frontend with Tailwind CSS and shadcn/ui, a Hono-based API backend with Durable Objects for persistent state management (like counters and demo items), and seamless deployment to Cloudflare's global edge network.

## Features

- **Edge-Native Backend**: Lightning-fast API routes using Hono on Cloudflare Workers.
- **Durable Objects**: Real-time, globally consistent state storage for counters, lists, and more (demo: `/api/counter`, `/api/demo`).
- **Modern React Frontend**: Vite-powered, with React Router, TanStack Query, and shadcn/ui components.
- **Theming & UI**: Dark/light mode support, responsive design with Tailwind CSS animations.
- **Type-Safe**: Full TypeScript support across frontend, backend, and shared types.
- **Production-Ready**: Error handling, logging, CORS, client error reporting, and SPA routing.
- **Demo Endpoints**:
  - `GET /api/test` - Basic health check.
  - `GET/POST /api/counter` - Persistent counter with increment.
  - `GET/POST/PUT/DELETE /api/demo` - CRUD for demo items stored in Durable Object.

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, React Router, TanStack Query
- **UI/UX**: shadcn/ui, Tailwind CSS, Lucide Icons, Sonner Toasts, Framer Motion
- **State & Data**: Immer, Zustand (ready), Durable Objects
- **Tools**: Bun (package manager), TypeScript, ESLint
- **DevOps**: Wrangler, Cloudflare Pages integration

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0)
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Cloudflare account and API token with Workers/Pages permissions

### Installation

1. Clone the repository:
   ```
   git clone <repo-url>
   cd flux-ticker-ub6ww10ixj5hu0rnhwv5r
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. (Optional) Generate Worker types:
   ```
   bun run cf-typegen
   ```

### Development

1. Start the dev server (frontend + worker proxy):
   ```
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

2. In another terminal, preview built app:
   ```
   bun preview
   ```

3. Add custom API routes in `worker/userRoutes.ts` (core files are protected).

### Build & Preview

```
bun run build
bun preview
```

## Deployment

Deploy to Cloudflare Workers with static assets (SPA + API):

```
bun run deploy
```

Or manually:

1. Build frontend:
   ```
   bun run build
   ```

2. Deploy with Wrangler:
   ```
   wrangler deploy
   ```

Configuration is in `wrangler.jsonc`. Assets are served as SPA, API routes (`/api/*`) handled by Worker first. Durable Objects auto-migrate.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rziman/flux-ticker-realtime-multi-source-crypto-stream)

## API Usage Examples

Test endpoints (dev or deployed):

```bash
# Counter
curl https://your-worker.dev/api/counter
curl -X POST https://your-worker.dev/api/counter/increment

# Demo Items (CRUD)
curl https://your-worker.dev/api/demo
curl -X POST https://your-worker.dev/api/demo \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "value": 100}'
```

Shared types in `shared/types.ts`. Extend in `worker/userRoutes.ts`.

## Project Structure

```
├── src/              # React frontend (Vite)
├── worker/           # Cloudflare Worker (Hono API)
├── shared/           # Shared types & mocks
├── public/           # Static assets
└── wrangler.jsonc    # Deployment config
```

## Customization

- **Frontend**: Edit `src/pages/HomePage.tsx`, use shadcn components (`@/components/ui/*`).
- **Backend**: Add routes to `worker/userRoutes.ts`. Use `Env` for Durable Objects.
- **Sidebar**: Customize `src/components/app-sidebar.tsx` and wrap pages in `AppLayout`.
- **Theme**: Built-in with `useTheme` hook.
- **Queries**: Use TanStack Query for API calls.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun preview` | Preview built app |
| `bun lint` | Lint code |
| `bun deploy` | Build + deploy |
| `wrangler types` | Generate types |

## Contributing

1. Fork & clone.
2. `bun install`.
3. Create feature branch.
4. `bun dev` & test.
5. PR with clear description.

## License

MIT. See [LICENSE](LICENSE) for details.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Issues: [GitHub Issues](https://github.com/user/repo/issues)