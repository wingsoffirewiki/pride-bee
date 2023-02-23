export function toPascalCase(str: string): string {
  return str
    .split(/[- A-Z]/)
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join("");
}
