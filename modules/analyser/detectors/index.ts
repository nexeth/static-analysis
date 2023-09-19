import { ARBITRARY_SEND_ETH_DETECTOR, ArbitrarySendEthDetector } from "./arbitray-send-eth";
import { NAMING_CONVENTION_DETECTOR, NamingConventionDetector } from "./naming-convention";
import { SHIFT_PARAMETER_MIXUP, ShiftParameterMixupDetector } from "./shift-parameter-mixup";
import { SUICIDAL, SuicidalDetector } from "./suicidal";
import { UNIMPLEMENTED_FUNCTION_DETECTOR, UnimplementedFunctionDetector } from "./unimplemented-function";
import { VAR_READ_USING_THIS, VarReadUsingThisDetector } from "./var-read-using-this";

export const Detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
  [NAMING_CONVENTION_DETECTOR]: NamingConventionDetector,
  [UNIMPLEMENTED_FUNCTION_DETECTOR]: UnimplementedFunctionDetector,
  [VAR_READ_USING_THIS]: VarReadUsingThisDetector,
  [SHIFT_PARAMETER_MIXUP]: ShiftParameterMixupDetector,
  [SUICIDAL]: SuicidalDetector,
};

export const detectors = Object.values(Detectors);
export type DetectorClass = (typeof detectors)[number];
