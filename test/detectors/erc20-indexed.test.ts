import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import { ERC20_INDEXED_DETECTOR, Erc20IndexedDetector } from "@/modules/analyser/detectors/erc20-indexed";
import { SeverityValue } from "@/types";

const erc20Base = ({ approval = true, transfer = true }: { approval?: boolean; transfer?: boolean }) => `
// Events
${transfer ? "event Transfer(address indexed from, address indexed to, uint256 value);" : ""}
${approval ? "event Approval(address indexed owner, address indexed spender, uint256 value);" : ""}

// ERC20 Standard Functions
function totalSupply() public view returns (uint256) {}

function balanceOf(address _owner) public view returns (uint256 balance) {}

function transfer(address _to, uint256 _value) public returns (bool success) {}

function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {}

function approve(address _spender, uint256 _value) public returns (bool success) {}

function allowance(address _owner, address _spender) public view returns (uint256 remaining) {}
`;

describe("Erc20IndexedDetector", () => {
  const detector = new Erc20IndexedDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(ERC20_INDEXED_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Un-indexed ERC20 Events");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe(
        "Detects whether events defined by the ERC20 specification that should have some parameters as indexed are missing the indexed keyword."
      );
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Informational);
    });
  });

  describe("detect", () => {
    test("should return no violations if there are no events in the contract", async () => {
      const code = `
        contract Test {
          function test() public {}
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return no violations if the contract is not ERC20", async () => {
      const code = `
        contract Test {
          event Transfer(address from, address to, uint256 value);
          event Approval(address owner, address spender, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return no violations for an indexed Transfer event", async () => {
      const code = `
        contract Test {
          ${erc20Base({ transfer: false })}
          event Transfer(address indexed from, address indexed to, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation on un-indexed Transfer event (both params)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ transfer: false })}
          event Transfer(address from, address to, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(2);
      expect(violations[0].message).toBe("ERC20 Transfer event should have indexed `from` parameter");
      expect(violations[1].message).toBe("ERC20 Transfer event should have indexed `to` parameter");
    });

    test("should return a violation on un-indexed Transfer event (first param)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ transfer: false })}
          event Transfer(address from, address indexed to, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("ERC20 Transfer event should have indexed `from` parameter");
    });

    test("should return a violation on un-indexed Transfer event (second param)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ transfer: false })}
          event Transfer(address indexed from, address to, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("ERC20 Transfer event should have indexed `to` parameter");
    });

    test("should return no violations for an indexed Approval event", async () => {
      const code = `
        contract Test {
          ${erc20Base({ approval: false })}
          event Approval(address indexed owner, address indexed spender, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation on un-indexed Approval event (both params)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ approval: false })}
          event Approval(address owner, address spender, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(2);
      expect(violations[0].message).toBe("ERC20 Approval event should have indexed `owner` parameter");
      expect(violations[1].message).toBe("ERC20 Approval event should have indexed `spender` parameter");
    });

    test("should return a violation on un-indexed Approval event (first param)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ approval: false })}
          event Approval(address owner, address indexed spender, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("ERC20 Approval event should have indexed `owner` parameter");
    });

    test("should return a violation on un-indexed Approval event (second param)", async () => {
      const code = `
        contract Test {
          ${erc20Base({ approval: false })}
          event Approval(address indexed owner, address spender, uint256 value);
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("ERC20 Approval event should have indexed `spender` parameter");
    });
  });
});
