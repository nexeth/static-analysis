import PinoLogger from "pino";
import Pretty from "pino-pretty";

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
}
