import http from "./http";
import type { IAgent, ICreateAgentRequest } from "../../interfaces/agents";

export async function listAgents(): Promise<IAgent[]> {
  const res = await http.get("/api/agents");
  return res.data;
}

export async function createAgent(payload: ICreateAgentRequest): Promise<IAgent> {
  const res = await http.post("/api/agents", payload);
  return res.data;
}
