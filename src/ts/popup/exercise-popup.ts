import { popup } from './popup';
import { getExerciseById } from './exercise-api';
import { ApiError, NETWORK_ERROR_STATUS } from './http-client';
import { createErrorMarkup, createExerciseMarkup } from './exercise-template';

const POPUP_ID = 'exercise-popup';
const PENDING_CLASS = 'pending';
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later.';
const ERROR_MESSAGES: Record<number, string> = {
  [NETWORK_ERROR_STATUS]: 'Check your internet connection and try again.',
  404: 'Exercise not found.',
};

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? (ERROR_MESSAGES[error.status] ?? DEFAULT_ERROR_MESSAGE)
    : DEFAULT_ERROR_MESSAGE;
}

class ExercisePopup {
  private requestedId: string | null = null;

  constructor(
    private readonly popupEl: HTMLElement,
    private readonly content: HTMLElement
  ) {
    document.addEventListener('click', this.handleTriggerClick);
  }

  async show(id: string): Promise<void> {
    this.requestedId = id;
    this.setPending(true);
    popup?.open(POPUP_ID);

    const markup = await this.loadMarkup(id);
    if (this.requestedId !== id) return;

    this.content.innerHTML = markup;
    this.setPending(false);
  }

  private async loadMarkup(id: string): Promise<string> {
    try {
      return createExerciseMarkup(await getExerciseById(id));
    } catch (error) {
      return createErrorMarkup(getErrorMessage(error));
    }
  }

  private setPending(isPending: boolean): void {
    if (isPending) this.content.innerHTML = '';
    this.popupEl.classList.toggle(PENDING_CLASS, isPending);
  }

  private readonly handleTriggerClick = (event: MouseEvent): void => {
    const trigger = (event.target as Element).closest<HTMLElement>(
      '[data-show-exercise]'
    );

    if (trigger?.dataset.showExercise) this.show(trigger.dataset.showExercise);
  };
}

const popupEl = document.getElementById(POPUP_ID);
const content = popupEl?.querySelector<HTMLElement>('[data-exercise-content]');

if (popupEl && content) {
  new ExercisePopup(popupEl, content);
}
