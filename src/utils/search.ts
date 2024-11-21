export function searchItems<T>(items: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  if (!searchTerm) return items;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return String(value).toLowerCase().includes(lowercaseSearch);
    })
  );
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}