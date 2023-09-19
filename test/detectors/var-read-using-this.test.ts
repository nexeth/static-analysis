import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import { VarReadUsingThisDetector } from "@/modules/analyser/detectors/var-read-using-this";
import { SeverityValue } from "@/types";

describe("VarReadUsingThisDetector", () => {
  const detector = new VarReadUsingThisDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe("var-read-using-this");
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Contract reads its own variable using `this`");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe(
        "The contract reads its own variable using `this`, adding overhead of an unnecessary STATICCALL."
      );
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Optimization);
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

    test("should return no violations for a contract containing no calls using this", async () => {
      const code = `
            contract Test {
            uint256 public foo;
            function bar() public {
                foo = 1;
            }
            }
        `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a contract containing a call using this in an expression", async () => {
      const code = `
                contract Test {
                uint256 public foo;
                function bar() public {
                    foo = this.foo;
                }
                }
            `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("function bar reads variable using `this`");
    });

    test("should return a violation for a contract containing a call using this in a conditional", async () => {
      const code = `
                    contract Test {
                    uint256 public foo;
                    function bar() public {
                        if (this.foo == 1) {
                            foo = 2;
                        }
                    }
                    }
                `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("function bar reads variable using `this`");
    });
  });
});
