const STORAGE_KEY = 'favorites';

export const FAVORITES_CHANGED = 'favorites:changed';

function writeFavorites(favorites: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function notifyFavoritesChanged(): void {
  document.dispatchEvent(new CustomEvent(FAVORITES_CHANGED));
}

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

  writeFavorites(favorites);
  notifyFavoritesChanged();

  return !isAdded;
}

export function pruneFavorites(idsToRemove: string[]): void {
  if (!idsToRemove.length) return;

  const remove = new Set(idsToRemove);
  writeFavorites(getFavorites().filter(id => !remove.has(id)));
}
