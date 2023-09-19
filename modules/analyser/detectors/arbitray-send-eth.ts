import { AbstractDetector } from "./abstract-detector";

import { DetectorViolation, ParsedContracts, SeverityValue, AnalyserConfig } from "@/types";

export const ARBITRARY_SEND_ETH_DETECTOR = "arbitrary-send-eth";

export class ArbitrarySendEthDetector extends AbstractDetector {
  public id = ARBITRARY_SEND_ETH_DETECTOR;
  public title = "Arbitrary Sending of ETH";
  public description = "Detects arbitrary send of ETH";
  public severity = SeverityValue.High;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  detect(code: ParsedContracts, config: AnalyserConfig): Promise<DetectorViolation[]> {
    // TODO implement this
    return Promise.resolve([]);
  }
}
