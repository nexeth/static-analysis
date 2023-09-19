import path from "path";

import PinoLogger from "pino";
import Pretty from "pino-pretty";

import { DetectorViolation, Severity } from "@/types";

export type ViolationLogProps = {
  violation: DetectorViolation;
  detectorId: string;
  severity: Severity;
  fileOptions?: {
    file: string;
    baseDir: string;
  };
};

export class Logger {
  public static logger = PinoLogger(
    Pretty({
      colorize: true,
      translateTime: true,
      ignore: "pid,hostname",
    })
  );

  static info(message: string) {
    this.logger.info(message);
  }

  static error(message: string) {
    this.logger.error(message);
  }

  static warn(message: string) {
    this.logger.warn(message);
  }

  static debug(message: string) {
    this.logger.debug(message);
  }

  static violation({
    violation: {
      message,
      node: { loc },
      contract,
    },
    detectorId,
    severity,
    fileOptions: { file, baseDir } = { file: "", baseDir: "" },
  }: ViolationLogProps) {
    const line = loc?.start.line;
    const column = loc?.start.column;

    const fileWithLocation = `${file}:${line}:${column}`;
    const filePath = path.join(baseDir, fileWithLocation);
    const clickableLocation = `\x1b]8;;file://${filePath}\x1b\\${fileWithLocation}\x1b]8;;\x1b\\`; // ANSI escape codes for hyperlink

    this.logger.error(
      `[${severity.toUpperCase()}] - {${detectorId}} ${message} in ${contract} at ${clickableLocation}
`
    );
  }
}
