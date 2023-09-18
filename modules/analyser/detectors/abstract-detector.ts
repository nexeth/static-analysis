import { AnalyserConfig, Detector, DetectorViolation, ParsedContracts, Severity } from "@/types";

export abstract class AbstractDetector implements Detector {
  public abstract id: string;
  public abstract title: string;
  public abstract description: string;
  public abstract severity: Severity;

  abstract detect(code: ParsedContracts, config?: AnalyserConfig): Promise<DetectorViolation[]>;
}
