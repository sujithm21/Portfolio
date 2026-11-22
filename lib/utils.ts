import { clsx, type ClassValue } from 'clsx';

/** Join class names, skipping falsy values. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** "AI Governance Platform" -> "ai-governance-platform" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
