import {
  ARBITRARY_SEND_ETH_DETECTOR,
  ArbitrarySendEthDetector,
} from "./arbitray-send-eth";
import {
  NAMING_CONVENTION_DETECTOR,
  NamingConventionDetector,
} from "./naming-convention";

export const detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
  [NAMING_CONVENTION_DETECTOR]: NamingConventionDetector,
} as const;

export type DetectorId = keyof typeof detectors;

export type DetectorClass = (typeof detectors)[DetectorId];
