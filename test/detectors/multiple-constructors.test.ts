import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import {
  MultipleConstructorsDetector,
  MULTIPLE_CONSTRUCTORS_DETECTOR,
} from "@/modules/analyser/detectors/multiple-constructors";
import { SeverityValue } from "@/types";

describe("MultipleConstructorsDetector", () => {
  const detector = new MultipleConstructorsDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(MULTIPLE_CONSTRUCTORS_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Multiple Constructors");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("Detected multiple constructor definitions in the same contract");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.High);
    });
  });

  describe("detect", () => {
    test("should return no violations for a contract with no constructor", async () => {
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

    test("should return no violations for a contract with one constructor", async () => {
      const code = `
        contract Test {
          constructor() public {}
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a contract with multiple constructors", async () => {
      const code = `
        contract Test {
          constructor() public {}
          constructor(uint256 a) public {}
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
    });

    test("should return no violations for extending a contract via a constructor", async () => {
      const code = `
        contract Test {
          constructor() public {}
        }

        contract Test2 is Test {
          constructor() Test() public {}
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });
  });
});
