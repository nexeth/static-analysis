import { describe, expect, test } from "bun:test";
import { SolidityParserService } from "../../services";
import {
  NAMING_CONVENTION_DETECTOR,
  NamingConventionDetector,
} from "../../detectors/naming-convention";
import { Severity } from "../../types";

const TEST_CONTRACT_FILE = "test/contracts/ViolationContract.sol";

describe("NamingConventionDetector", () => {
  const source = SolidityParserService.parseFile(TEST_CONTRACT_FILE);

  const detector = new NamingConventionDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(NAMING_CONVENTION_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Solidity Naming Convention Checker");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe(
        "Checks if Solidity naming conventions are followed"
      );
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(Severity.Informational);
    });
  });

  describe("detect", () => {
    console.log(source);
    const response = detector.detect(source, {});
  });
});
