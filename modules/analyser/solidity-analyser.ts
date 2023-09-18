import Logger from "pino";

import { AnalyserConfig } from "@/types";

/**
 * A service for detecting vulnerabilities in Solidity code.
 */
export class SolidityAnalyser {
  private logger: ReturnType<typeof Logger>;

  private config: AnalyserConfig;

  constructor(config: AnalyserConfig = {}) {
    this.config = config;
    this.logger = Logger();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public analyse(code: string) {
    this.logger.info("Analyzing Solidity code...");
  }
}
