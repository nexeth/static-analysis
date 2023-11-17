import { ARBITRARY_SEND_ETH_DETECTOR, ArbitrarySendEthDetector } from "./arbitray-send-eth";
import { ASSEMBLY_DETECTOR, AssemblyDetector } from "./assembly";
import { MULTIPLE_CONSTRUCTORS_DETECTOR, MultipleConstructorsDetector } from "./multiple-constructors";
import { NAMING_CONVENTION_DETECTOR, NamingConventionDetector } from "./naming-convention";
import { SHIFT_PARAMETER_MIXUP_DETECTOR, ShiftParameterMixupDetector } from "./shift-parameter-mixup";
import { SUICIDAL as SUICIDAL_DETECTOR, SuicidalDetector } from "./suicidal";
import { UNIMPLEMENTED_FUNCTION_DETECTOR, UnimplementedFunctionDetector } from "./unimplemented-function";
import { VAR_READ_USING_THIS_DETECTOR, VarReadUsingThisDetector } from "./var-read-using-this";

export const Detectors = {
  [ARBITRARY_SEND_ETH_DETECTOR]: ArbitrarySendEthDetector,
  [NAMING_CONVENTION_DETECTOR]: NamingConventionDetector,
  [UNIMPLEMENTED_FUNCTION_DETECTOR]: UnimplementedFunctionDetector,
  [VAR_READ_USING_THIS_DETECTOR]: VarReadUsingThisDetector,
  [SHIFT_PARAMETER_MIXUP_DETECTOR]: ShiftParameterMixupDetector,
  [SUICIDAL_DETECTOR]: SuicidalDetector,
  [ASSEMBLY_DETECTOR]: AssemblyDetector,
  [MULTIPLE_CONSTRUCTORS_DETECTOR]: MultipleConstructorsDetector,
};

export const detectors = Object.values(Detectors);
export type DetectorClass = (typeof detectors)[number];
