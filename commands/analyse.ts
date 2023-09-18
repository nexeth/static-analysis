import { Logger, SolidityAnalyser, SolidityParser } from "@/modules";
import { AnalyserConfig } from "@/types";

export const analyse = async (file: string, config: AnalyserConfig = {}) => {
  Logger.info(`Analyzing ${file}`);
  const parsedContracts = SolidityParser.parseFile(file);
  const analyser = new SolidityAnalyser(config);
  await analyser.analyse(parsedContracts);
};
