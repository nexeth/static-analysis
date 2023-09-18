import { AbstractDetector } from "./abstract-detector";

import { DetectorViolation, ParsedContract, Severity } from "@/types";
import { AnalyserConfig } from "@/types/config";

export const ARBITRARY_SEND_ETH_DETECTOR = "arbitrary-send-eth";

export class ArbitrarySendEthDetector implements AbstractDetector {
  public id = ARBITRARY_SEND_ETH_DETECTOR;
  public title = "Arbitrary Sending of ETH";
  public description = "Detects arbitrary send of ETH";
  public severity = Severity.High;

  detect(code: ParsedContract, config: AnalyserConfig): Promise<DetectorViolation[]> {
    console.log(code, config);
    throw new Error("Method not implemented.");
  }
}
