// GET /api/lead-token — o formulário pede esta chave ao abrir e a devolve ao enviar.
// Robôs que postam direto na API (sem abrir a página) não têm a chave e caem em "Suspeitos".
import { issueLeadToken, originAllowed, send } from "./_lib.js";

export default function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { erro: "método não permitido" }, { Allow: "GET" });
  if (!originAllowed(req)) return send(res, 403, { erro: "origem não permitida" });
  return send(res, 200, { k: issueLeadToken() });
}
