import { describe, expect, test } from "bun:test";

import { TEMPLATE_ID, TemplateDetector } from "@/modules/analyser/detectors/template";
import { SeverityValue } from "@/types";

describe("TemplateDetector", () => {
  const detector = new TemplateDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(TEMPLATE_ID);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Informational);
    });
  });

  describe("detect", () => {});
});
