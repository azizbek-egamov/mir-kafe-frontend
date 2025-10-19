import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return twMerge(
    inputs
      .map((input) => {
        if (typeof input === "string") return input
        if (!input) return ""
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(" ")
      })
      .join(" "),
  )
}
