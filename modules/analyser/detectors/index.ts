import { ARBITRARY_SEND_ETH_DETECTOR, ArbitrarySendEthDetector } from "./arbitray-send-eth";
import { NAMING_CONVENTION_DETECTOR, NamingConventionDetector } from "./naming-convention";
import { UNIMPLEMENTED_FUNCTION_DETECTOR, UnimplementedFunctionDetector } from "./unimplemented-function";

export const Detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
  [NAMING_CONVENTION_DETECTOR]: NamingConventionDetector,
  [UNIMPLEMENTED_FUNCTION_DETECTOR]: UnimplementedFunctionDetector,
};

export const detectors = Object.values(Detectors);
export type DetectorClass = (typeof detectors)[number];
