import { Hono } from "hono";
import { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/ws', async (c) => {
        const id = c.env.GlobalDurableObject.idFromName("global");
        const stub = c.env.GlobalDurableObject.get(id);
        return stub.fetch(c.req.raw);
    });
    app.get('/api/health', (c) => c.json({ success: true, status: 'ok' }));
}