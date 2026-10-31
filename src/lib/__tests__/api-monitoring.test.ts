import { describe, expect, it } from "vitest";
import { API_MONITOR_REFRESH_MS, canViewApiMonitoring, extractTokenUsage } from "../api-monitoring";

describe("private API monitoring", () => {
  it("allows only the verified requested admin", () => {
    expect(canViewApiMonitoring("mentorwiseaiedtech@gmail.com", true, true)).toBe(true);
    expect(canViewApiMonitoring("saifahmedmentorwise@gmail.com", true, true)).toBe(false);
    expect(canViewApiMonitoring("student@example.com", true, false)).toBe(false);
    expect(canViewApiMonitoring("mentorwiseaiedtech@gmail.com", false, true)).toBe(false);
    expect(canViewApiMonitoring("mentorwiseaiedtech@gmail.com", true, false)).toBe(false);
  });
  it("refreshes every 30 seconds", () => {
    expect(API_MONITOR_REFRESH_MS).toBe(30_000);
  });
  it("keeps missing token counts unknown rather than fabricating zero", () => {
    expect(extractTokenUsage({})).toEqual({ input_tokens: null, output_tokens: null, total_tokens: null });
    expect(extractTokenUsage({ usage: { prompt_tokens: 17, completion_tokens: 9, total_tokens: 26 } })).toEqual({ input_tokens: 17, output_tokens: 9, total_tokens: 26 });
  });
});