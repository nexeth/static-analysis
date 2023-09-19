import { AbstractDetector } from "./abstract-detector";

import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const TEMPLATE_ID = "unimplemented-function";

export class TemplateDetector extends AbstractDetector {
  public id = TEMPLATE_ID;
  public title = "";
  public description = "";
  public severity = SeverityValue.Informational;

  detect(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    return Promise.resolve([]);
  }
}
