import { sampleData } from "./sample-data";

const repositories = sampleData.repositories;

export const repoOptions = repositories
  .filter((repo) => repo && repo.name)
  .map((repo) => ({
    id: repo.id,
    name: repo.name,
  }));
