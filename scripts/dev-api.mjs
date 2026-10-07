// Servidor local que expõe /api/collect e /api/stats com armazenamento em memória.
// Uso: `npm run dev:api` (o Vite já faz proxy de /api para cá em desenvolvimento).
import http from "node:http";
import { pathToFileURL } from "node:url";
import collect from "../api/collect.js";
import stats from "../api/stats.js";
import lead from "../api/lead.js";
import leads from "../api/leads.js";

const routes = { "/api/collect": collect, "/api/stats": stats, "/api/lead": lead, "/api/leads": leads };

export function createServer() {
  return http.createServer(async (req, res) => {
    const path = new URL(req.url, "http://x").pathname;
    const handler = routes[path];
    if (!handler) {
      res.statusCode = 404;
      return res.end("not found");
    }
    await handler(req, res);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.env.DASHBOARD_PASSWORD ||= "teste";
  const port = Number(process.env.API_PORT) || 8788;
  createServer().listen(port, () => {
    console.log(`API local em http://localhost:${port}  (senha do painel: ${process.env.DASHBOARD_PASSWORD})`);
  });
}
