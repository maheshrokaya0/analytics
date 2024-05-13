import { drizzle } from 'drizzle-orm/d1';
import { sessions } from './db/schema';
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Env = {
  DB: D1Database;
};

interface collectRequestBody {
  domain: string;
  pathname?: string;
  referrer?: string;
  screen?: string;
}

const app = new Hono<{Bindings: Env}>();

app.use('/', cors())

app.post('/', async (c) => {
  const db = drizzle(c.env.DB);
  const data = JSON.parse(await c.req.text());
  const sessionData: collectRequestBody = {
    domain: data.domain,
    pathname: data.pathname,
    referrer: data.referrer,
    screen: data.screen,
  }

  console.log(sessionData)

  const rd = c.req.raw;
  const metadata = c.req;
  console.log(rd.cf?.country, rd.cf?.timezone, rd.cf?.city, rd.cf?.region)
  const ip = c.req.raw.headers.get('CF-Connecting-IP');
  console.log(data);
  // const result = await db
  // .insert(sessions)
  // .values({browser, country})
  // .returning();
  // return c.json(result);
  return c.json({ data, rd, metadata },200)
})
export default app

// app.get('/api/event', async (c) => {
//   const db = drizzle(c.env.DB);
//   const result = await db.select().from(sessions).all();
//   return c.json(result);
// })