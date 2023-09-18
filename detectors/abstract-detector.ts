import {
  AnalysisConfig,
  Detector,
  DetectorViolation,
  ParsedContract,
  Severity,
} from "@/types";

export abstract class AbstractDetector implements Detector {
  public abstract id: string;
  public abstract title: string;
  public abstract description: string;
  public abstract severity: Severity;

  abstract detect(
    code: ParsedContract,
    config?: AnalysisConfig
  ): Promise<DetectorViolation[]>;
}
