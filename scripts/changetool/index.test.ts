import test from "ava";

import { isValidChangenote } from "./index.js";

test("recognizes an unordered Markdown list", (t) => {
  const inputs = [
    "- One changenote entry",
    "- First item\n- Second item",
    "\n\n\n\n- Fixed a bug\n- Added a feature",
  ];

  for (const input of inputs) {
    t.true(isValidChangenote(input));
  }
});

test("does not recognize non-Markdown text", (t) => {
  const inputs = [
    "This is not a list.",
    `["this", "is", "JSON"]`,
    "---",
    "***",
    "___",
    "paragraph",
  ];

  for (const input of inputs) {
    t.false(isValidChangenote(input));
  }
});

test("does not recognize ordered Markdown lists", (t) => {
  const inputs = [
    "1. First item\n2. Second item",
    "\n\n\n1. First item\n1. Second item",
  ];

  for (const input of inputs) {
    t.false(isValidChangenote(input));
  }
});

test("list item must start with a hyphen", (t) => {
  const inputs = [
    ["- Fixed a bug\n- Added feature", true],
    ["* Fixed a bug\n* Added feature", false],
    ["+ Fixed a bug\n+ Added feature", false],
    ["- Fixed a bug\n* Added feature", false],
    ["- Fixed a bug\n+ Added feature", false],
    ["\n\n\n- Fixed a bug", true],
    ["\n\n\n* Fixed a bug", false],
    ["\n\n\n+ Fixed a bug", false],
    ["---\n* Fixed a bug\n* Added feature", false],
  ] as const;

  for (const [input, expected] of inputs) {
    t.is(isValidChangenote(input), expected);
  }
});

test("does not contain other Markdown elements", (t) => {
  const inputs = [
    "- Fixed a bug\n\nParagraph of text",
    "- Fixed a bug\n\n* Added a feature",
    "# Header\n- Fixed a bug",
    "- Fixed a bug\n## Subheader",
  ];

  for (const input of inputs) {
    t.false(isValidChangenote(input));
  }
});
