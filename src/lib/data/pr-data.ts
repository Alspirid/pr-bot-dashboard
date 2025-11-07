import { EnrichedPR } from "@/types";
import { sampleData } from "./sample-data";

export function getAllPRs(): EnrichedPR[] {
  return sampleData.pullRequests;
}

export function getPRById(id: string): EnrichedPR | undefined {
  return sampleData.pullRequests.find((pr) => pr.id.toString() === id);
}
