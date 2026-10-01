// Local demo server for REACT — runs the Vercel API functions on plain Node.
// No Vercel account, no login, no env vars needed.
import http from "node:http";
import systemHandler from "./.local-api/api/system.js";
import simulationHandler from "./.local-api/api/simulation.js";

function adapt(handler) {
  return async (nodeReq, nodeRes) => {
    nodeRes.setHeader("Access-Control-Allow-Origin", "*");
    nodeRes.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    nodeRes.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (nodeReq.method === "OPTIONS") {
      nodeRes.writeHead(204);
      nodeRes.end();
      return;
    }
    let raw = "";
    for await (const chunk of nodeReq) raw += chunk;
    const req = {
      method: nodeReq.method,
      query: Object.fromEntries(new URL(nodeReq.url, "http://localhost").searchParams),
      body: raw ? JSON.parse(raw) : undefined,
    };
    const res = {
      _code: 200,
      status(code) {
        this._code = code;
        return this;
      },
      json(obj) {
        nodeRes.writeHead(this._code, { "Content-Type": "application/json" });
        nodeRes.end(JSON.stringify(obj));
      },
    };
    try {
      await handler(req, res);
    } catch (err) {
      console.error("handler error:", err);
      nodeRes.writeHead(500, { "Content-Type": "application/json" });
      nodeRes.end(JSON.stringify({ error: "local handler failed" }));
    }
  };
}

const routes = {
  "/api/system": adapt(systemHandler),
  "/api/simulation": adapt(simulationHandler),
};

http
  .createServer((nodeReq, nodeRes) => {
    const path = new URL(nodeReq.url, "http://localhost").pathname;
    const route = routes[path];
    if (route) {
      route(nodeReq, nodeRes);
    } else {
      nodeRes.writeHead(404, { "Content-Type": "application/json" });
      nodeRes.end(JSON.stringify({ error: "not found" }));
    }
  })
  .listen(3000, () => console.log("REACT local API running at http://localhost:3000"));
