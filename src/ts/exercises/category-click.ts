import type { FilterName } from '../types/exercise';
import { exercisesLimit, loadExercises } from './exercises-page';

/**
 * ТИМЧАСОВИЙ клей: клік по картці категорії -> показати вправи цієї категорії.
 * Коли учасник із категоріями/фільтрами зробить навігацію (breadcrumb, пошук) —
 * він сам викликає loadExercises(...) і цей файл можна видалити.
 */
const categoriesList = document.querySelector<HTMLElement>('.js-categories-list');
const exercisesSection = document.querySelector<HTMLElement>('#exercises');

categoriesList?.addEventListener('click', event => {
  const btn = (event.target as Element).closest<HTMLElement>('.category-card-btn');
  const { filter, name } = btn?.dataset ?? {};
  if (!filter || !name) return;

  categoriesList.style.display = 'none';
  if (exercisesSection) exercisesSection.hidden = false;

  void loadExercises({ filter: filter as FilterName, category: name, page: 1, limit: exercisesLimit() });
});
