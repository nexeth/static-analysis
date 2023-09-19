import { AbstractDetector } from "./abstract-detector";

import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const TEMPLATE_ID = "unimplemented-function";

export class UnimplementedFunctionDetector extends AbstractDetector {
  public id = TEMPLATE_ID;
  public title = "Unimplemented Function";
  public description = "Detects unimplemented functions on derived contracts";
  public severity = SeverityValue.Informational;

  detect(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    return Promise.resolve([]);
  }
}
