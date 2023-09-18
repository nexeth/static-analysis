import { Command, program } from "commander";

import { analyse } from "./analyse";

import { AnalyserConfig } from "@/types";

export const commandConfig = (): {
  config: AnalyserConfig;
  program: Command;
} => {
  program
    .name("nexeth")
    .description(
      "Nexeth is a static analysis tool written in TypeScript for Solidity smart contracts. It helps identify potential vulnerabilities, coding style violations, and other issues in Solidity code. This tool is based on the popular Slither tool but ported to TypeScript for use with the Bun runtime environment."
    )
    .version("0.1.0");

  program.command("analyse <file>").description("Analyse a solidity file for vulnerabilities").action(analyse);
  program.parse();

  const config: AnalyserConfig = {};

  return { config, program };
};
