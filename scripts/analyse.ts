import { SolidityAnalyser } from "@/modules";

const main = async () => {
  const analyser = new SolidityAnalyser();

  analyser.analyse("pragma solidity ^0.8.0; contract Foo {}");
};

main();
