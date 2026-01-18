// backend/services/nara-client.service.ts

import { NaraResponse } from "../models/nara-raw-model";
import { Ead } from "../models/ead3.model";
import { NaraMapperService } from "./nara-mapper.service";

interface NaraClientConfig {
  baseUrl: string;
  apiKey: string;
  timeoutSeconds: number;
  useMock?: boolean;
}

export class NaraClientService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private useMock: boolean;
  private mapper: NaraMapperService;

  constructor(config: NaraClientConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeoutSeconds * 1000;
    this.useMock = config.useMock ?? false;
    this.mapper = new NaraMapperService();
  }

  async searchAndMapToEad3(rawQuery: string): Promise<Ead[]> {
    const naraResponse = this.useMock
      ? (JSON.parse(await this.getMockJson(rawQuery)) as NaraResponse)
      : await this.getNaraResponse(rawQuery);

    return this.mapper.mapHitsToEad3(naraResponse.body?.hits?.hits || []);
  }

  async getFullAndMapToEad3(naId: number): Promise<Ead> {
    const url = `records/search?q=record.naId:${naId}&limit=1`;

    const naraResponse = await this.getNaraResponse(url);

    const firstHit = naraResponse.body?.hits?.hits?.[0];
    if (!firstHit) {
      throw new Error(`No record found for naId: ${naId}`);
    }

    return this.mapper.mapHitToEad3(firstHit);
  }

  async getChildrenAndMapToEad3(
    parentId: number,
    limit: number,
  ): Promise<Ead[]> {
    const url = `records/parentNaId/${parentId}?limit=${limit}`;

    const naraResponse = await this.getNaraResponse(url);

    return this.mapper.mapHitsToEad3(naraResponse.body?.hits?.hits || []);
  }

  private async getNaraResponse(queryOrUrl: string): Promise<NaraResponse> {
    const url = queryOrUrl.startsWith("records/")
      ? queryOrUrl
      : `records/search${queryOrUrl}`;

    const fullUrl = `${this.baseUrl}/${url}`;
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // const headers: Record<string, string> = {
      //   Accept: "application/json",
      //   "User-Agent": "Saga/1.0 (Electron)",
      // };

      // if (this.apiKey) {
      //   headers["x-api-key"] = this.apiKey;
      // }

      // const response = await fetch(fullUrl, {
      //   headers,
      //   signal: controller.signal,
      // });

      const response = await fetch(fullUrl, {
        headers: {
          Accept: "application/json",
          "x-api-key": this.apiKey,
        },
        signal: controller.signal,
      });

      const elapsed = Date.now() - startTime;
      // console.log(`[NARA] Request took ${elapsed} ms | URL: ${url}`);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `NARA API error ${response.status}: ${text.slice(0, 200)}`,
        );
      }

      return (await response.json()) as NaraResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async getMockJson(rawQuery: string): Promise<string> {
    const fs = require("fs").promises;
    const path = require("path");

    let mockFile = "nara_response_4_item.json";
    if (rawQuery.includes("=1")) mockFile = "nara_response_1_rg.json";
    else if (rawQuery.includes("=2")) mockFile = "nara_response_2_s.json";
    else if (rawQuery.includes("=3")) mockFile = "nara_response_3_fu.json";

    const mockPath = path.join(process.cwd(), "mocks", mockFile);
    console.log(`[NARA] Using MOCK data from ${mockFile}`);

    return await fs.readFile(mockPath, "utf-8");
  }
}
