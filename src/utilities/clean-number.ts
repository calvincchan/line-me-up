/** Remove non-numeric characters, only keeping the numbers */
export function cleanNumber(number: string) {
  return number.replace(/\D/g, "").trim();
}
