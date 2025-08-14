export const join = <T, U>(items: T[], separator: U): (T | U)[] => items.flatMap(item => [item, separator]).slice(0, -1)
