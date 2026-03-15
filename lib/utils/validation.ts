export function validateName(name: string) {
  if (!name.trim() || name.length < 3) {
    return "Enter Full Name";
  }
  return null;
}