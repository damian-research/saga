// backend/services/nara-client.factory.ts

import { NaraClientService } from "./nara-client.service";

export function createNaraClient(): NaraClientService {
  return new NaraClientService({
    baseUrl: process.env.NARA_BASE_URL || "https://catalog.archives.gov/api/v2",
    apiKey: process.env.NARA_API_KEY || "",
    timeoutSeconds: 30,
    useMock: process.env.USE_MOCK === "false",
  });
}
