import { fetchExercises } from './api-exercises';
import type { Exercise, ExerciseOpenDetail, ExercisesParams } from '../types/exercise';
import { createExerciseCards } from './exercises-cards';
import { renderPagination } from './pagination';
import { cardLimit } from '../utils/card-limit';
import { writeExercisesQuery } from '../utils/query-params';

const EMPTY_TEXT =
  'Unfortunately, no results were found. You may want to consider other search query parameters to find the exercise you are looking for. Try again.';

const list = document.querySelector<HTMLUListElement>('.exercises__list');
const message = document.querySelector<HTMLParagraphElement>('.exercises__message');
const loader = document.querySelector<HTMLElement>('.exercises__content > .loader');
const pagination = document.querySelector<HTMLElement>('.pagination');

let lastParams: ExercisesParams | null = null;
let requestId = 0;

const loaded = new Map<string, Exercise>();
export const getLoadedExercise = (id: string): Exercise | undefined => loaded.get(id);

export const exercisesLimit = (): number =>
  cardLimit({ mobileLimit: 8, desktopLimit: 10 });

function setLoading(on: boolean): void {
  if (loader) loader.hidden = !on;
}

function showMessage(text: string): void {
  if (!message) return;
  message.textContent = text;
  message.hidden = false;
}

function hideMessage(): void {
  if (message) message.hidden = true;
}

export async function loadExercises(params: ExercisesParams): Promise<void> {
  if (!list) return;
  lastParams = params;
  const currentRequest = ++requestId;
  setLoading(true);
  hideMessage();

  writeExercisesQuery({
    filter: params.filter,
    category: params.category,
    page: params.page,
    keyword: params.keyword,
  });

  try {
    const data = await fetchExercises(params);
    if (currentRequest !== requestId) return;

    const page = Number(data.page);
    if (page !== params.page) {
      writeExercisesQuery({
        filter: params.filter,
        category: params.category,
        page,
        keyword: params.keyword,
      });
      lastParams = { ...params, page };
    }

    data.results.forEach(item => loaded.set(item._id, item));
    list.replaceChildren(...createExerciseCards(data.results, 'home'));
    if (data.results.length === 0) {
      showMessage(
        params.keyword
          ? 'No such exercise'
          : EMPTY_TEXT
      );
    } if (pagination) {
      renderPagination(pagination, { page, totalPages: data.totalPages });
    }
  } catch {
    if (currentRequest !== requestId) return;
    list.replaceChildren();
    pagination?.replaceChildren();
    showMessage('Something went wrong. Please try again later.');
  } finally {
    if (currentRequest === requestId) setLoading(false);
  }
}

list?.addEventListener('click', (event) => {
  const btn = (event.target as Element).closest<HTMLElement>('[data-action="start"]');
  const id = btn?.closest<HTMLElement>('.exercise-card')?.dataset.id;
  if (!id) return;
  document.dispatchEvent(
    new CustomEvent<ExerciseOpenDetail>('exercise:open', { detail: { id } }),
  );
});

pagination?.addEventListener('click', (event) => {
  const btn = (event.target as Element).closest<HTMLElement>('[data-page]');
  const page = Number(btn?.dataset.page);
  if (!btn || !page || !lastParams) return;
  void loadExercises({ ...lastParams, page });
});