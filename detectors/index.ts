import {
  ARBITRARY_SEND_ETH_DETECTOR,
  ArbitrarySendEthDetector,
} from "./arbitray-send-eth";

export const detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
} as const;
