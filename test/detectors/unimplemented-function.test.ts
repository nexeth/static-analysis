import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import {
  UNIMPLEMENTED_FUNCTION_DETECTOR,
  UnimplementedFunctionDetector,
} from "@/modules/analyser/detectors/unimplemented-function";
import { SeverityValue } from "@/types";

describe("UnimplementedFunctionDetector", () => {
  const detector = new UnimplementedFunctionDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(UNIMPLEMENTED_FUNCTION_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Unimplemented Function");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("Detects unimplemented functions on derived contracts");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Informational);
    });
  });

  describe("detect", () => {
    test("should return no violations for a contract with no functions", async () => {
      const code = `
        contract Test {
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return no violations for a contract with no unimplemented functions", async () => {
      const code = `
        contract Test {
          function foo() public {
          }
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a function in the interface that is not implemented", async () => {
      const code = `
      interface BaseInterface {
        function f1() external returns(uint);
        function f2() external returns(uint);
      }

      contract DerivedContract is BaseInterface {
          function f1() external returns(uint){
              return 42;
          }
      }`;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].target).toBe("function");
      expect(violations[0].name).toBe("f2");
      expect(violations[0].violation).toBe("unimplemented");
    });

    test("should not return a violation if a state variable overrides a function", async () => {
      const code = `
        interface BaseInterface {
          function f1() external returns(uint);
          function f2() external returns(uint);
        }

        contract DerivedContract is BaseInterface {
            uint f1 = 42;
            function f2() external returns(uint){
                return 42;
            }
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });
  });
});
