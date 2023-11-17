import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import {
  SHIFT_PARAMETER_MIXUP_DETECTOR,
  ShiftParameterMixupDetector,
} from "@/modules/analyser/detectors/shift-parameter-mixup";
import { SeverityValue } from "@/types";

describe("ShiftParameterMixupDetector", () => {
  const detector = new ShiftParameterMixupDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(SHIFT_PARAMETER_MIXUP_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Incorrect shift in assembly.");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("The order of parameters in a shift instruction is incorrect.");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.High);
    });
  });

  describe("detect", () => {
    test("should return no violations for a contract with no violating functions", async () => {
      const code = `
        contract Test {
          function foo(uint256 a, uint256 b) public pure returns (uint256) {
            return a + b;
          }
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a contract with an invalid right shift", async () => {
      const code = `
      contract C {
        function f() internal returns (uint a) {
            assembly {
                a := shr(a, 8)
            }
        }
    }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
    });

    test("should return a violation for a contract with an invalid left shift", async () => {
      const code = `
      contract C {
        function f() internal returns (uint a) {
            assembly {
                a := shl(a, 8)
            }
        }
    }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
    });
  });
});
