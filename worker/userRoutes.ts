import { Hono } from "hono";
import { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/ws', async (c) => {
        console.log('Hit /api/ws proxy route, upgrade:', c.req.header('upgrade'));
        const id = c.env.GlobalDurableObject.idFromName("global");
        const stub = c.env.GlobalDurableObject.get(id);
        return stub.fetch(c.req.raw);
    });

    app.get('/api/market', async (c) => {
        console.log('Hit /api/market poll');
        const id = c.env.GlobalDurableObject.idFromName('global');
        const stub = c.env.GlobalDurableObject.get(id);
        const data = await stub.getMarketData();
        return c.json(data);
    });
    app.get('/api/health', (c) => c.json({ success: true, status: 'ok' }));
}