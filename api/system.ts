import type { VercelRequest, VercelResponse } from "@vercel/node";
import { seedState } from "./_lib/mockData.js";

/**
 * GET /api/system
 * Returns the initial emergency state (fresh flood scenario).
 * Frontend holds state after this; backend stays stateless.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  res.status(200).json(seedState());
}
