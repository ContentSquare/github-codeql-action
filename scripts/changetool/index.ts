import { fromMarkdown } from "mdast-util-from-markdown";

export function isValidChangenote(changenote: string): boolean {
  const ast = fromMarkdown(changenote);

  // Change-notes must be a single unordered list, with no other Markdown elements.
  if (
    ast.children.length !== 1 ||
    ast.children[0].type !== "list" ||
    ast.children[0].ordered === true
  ) {
    return false;
  }

  // Each list item must start with a hyphen, and not an asterisk or plus sign.
  const lines = changenote.split("\n");
  return ast.children[0].children.every((listItem) => {
    // Parsed nodes will always have source positions, so this non-null assertion is safe here.
    return lines[listItem.position!.start.line - 1].startsWith("-");
  });
}
