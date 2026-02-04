import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders without crashing", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Hourfy");
  });
});
