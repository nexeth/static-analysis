import { ARBITRARY_SEND_ETH_DETECTOR, ArbitrarySendEthDetector } from "./arbitray-send-eth";
import { NAMING_CONVENTION_DETECTOR, NamingConventionDetector } from "./naming-convention";
import { UNIMPLEMENTED_FUNCTION_DETECTOR, UnimplementedFunctionDetector } from "./unimplemented-function";

export const detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
  [NAMING_CONVENTION_DETECTOR]: NamingConventionDetector,
  [UNIMPLEMENTED_FUNCTION_DETECTOR]: UnimplementedFunctionDetector,
} as const;

export type DetectorId = keyof typeof detectors;

export type DetectorClass = (typeof detectors)[DetectorId];
