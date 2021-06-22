export function htmlDecode(input: string | null): string | null  {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
