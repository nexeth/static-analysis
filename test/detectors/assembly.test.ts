import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import { ASSEMBLY_DETECTOR, AssemblyDetector } from "@/modules/analyser/detectors/assembly";
import { SeverityValue } from "@/types";

describe("AssemblyDetector", () => {
  const detector = new AssemblyDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(ASSEMBLY_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Assembly usage");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("The use of assembly is error-prone and should be avoided.");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Informational);
    });
  });

  describe("detect", () => {
    test("should return no violations for a contract without assembly", async () => {
      const code = `contract Test {
        function foo() public {}
      }
    `;
      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a contract with assembly", async () => {
      const code = `contract Test {
            function foo() public {
                assembly {
                    mstore(0x80, 0x40)
                }
            }
        }
        `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      const [violation] = violations;
      expect(violation.message).toBe("function foo contains assembly");
    });
  });
});
