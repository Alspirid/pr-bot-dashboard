import { EnrichedPR } from "@/types";
import {
  enrichPRWithRiskData,
  generateDashboardData,
} from "./fake-data-generator";

const rawData = generateDashboardData();

export const sampleData = {
  repositories: rawData.repositories,
  pullRequests: rawData.pullRequests.map((pr) =>
    enrichPRWithRiskData(pr, rawData.comments.get(pr.id) || [])
  ) as EnrichedPR[],
  users: rawData.users,
};
