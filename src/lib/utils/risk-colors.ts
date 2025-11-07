/**
 * Returns Tailwind CSS classes for color-coding risk scores
 * @param score Risk score (0-100)
 * @returns Tailwind CSS class string for text color and font weight
 */
export function getRiskScoreColor(score: number): string {
  if (score >= 70) return "text-red-600 font-bold";
  if (score >= 40) return "text-orange-600 font-semibold";
  return "text-green-600";
}
