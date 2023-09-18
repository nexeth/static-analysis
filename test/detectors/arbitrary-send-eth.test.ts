import { describe, expect, test } from "bun:test";

import { ARBITRARY_SEND_ETH_DETECTOR, ArbitrarySendEthDetector } from "@/modules/analyser/detectors/arbitray-send-eth";
import { SeverityValue } from "@/types";

describe("ArbitrarySendEthDetector", () => {
  const detector = new ArbitrarySendEthDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(ARBITRARY_SEND_ETH_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Arbitrary Sending of ETH");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("Detects arbitrary send of ETH");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.High);
    });
  });

  describe("detect", () => {
    test.todo("should detect");
  });
});
