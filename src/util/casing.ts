export function toPascalCase(str: string): string {
	if (str.length === 0) {
		return str;
	}

	return str
		.split(/[- A-Z]/)
		.map((word) => word[0].toUpperCase() + word.substring(1))
		.join("");
}
