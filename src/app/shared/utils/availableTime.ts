export function isValidDate(date: Date | null): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isAvailabelTime(
  availabelDate: Date | null,
  expirationDate: Date | null
): boolean {
  const now = new Date().getTime();
  const hasStart = isValidDate(availabelDate);
  const hasEnd = isValidDate(expirationDate);

  if (hasStart && hasEnd) {
    return now >= availabelDate!.getTime() && now <= expirationDate!.getTime();
  }

  if (hasStart && !hasEnd) {
    return now >= availabelDate!.getTime();
  }

  if (!hasStart && hasEnd) {
    return now <= expirationDate!.getTime();
  }

  return true; // không có ngày nào thì coi như khả dụng
}
