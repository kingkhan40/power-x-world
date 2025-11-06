export function generateRefCode(name: string) {
  const base = (name || "user").toLowerCase().replace(/\s+/g, "-").slice(0, 8);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${base}-${rand}`;
}
