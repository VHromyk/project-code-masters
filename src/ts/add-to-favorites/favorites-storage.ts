const STORAGE_KEY = 'favorites';

export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  let favorites = getFavorites();
  const isAdded = favorites.includes(id);

  if (isAdded) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

  return !isAdded;
}
