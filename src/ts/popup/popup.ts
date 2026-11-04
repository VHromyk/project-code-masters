const ANIMATION_DURATION = 500;

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class PopupManager {
  private backdrop: HTMLElement;
  private activePopup: HTMLElement | null = null;
  private isAnimating = false;

  constructor(backdrop: HTMLElement) {
    this.backdrop = backdrop;
    document.addEventListener('click', this.onOpenClick);
  }

  async open(id: string): Promise<void> {
    const popup = document.getElementById(id);

    if (!popup || !this.backdrop.contains(popup)) return;
    if (popup === this.activePopup || this.isAnimating) return;

    this.isAnimating = true;

    if (this.activePopup) {
      await this.hidePopup(this.activePopup);
    } else {
      this.lockBody();
      this.showBackdrop();
    }

    await this.showPopup(popup);
    this.isAnimating = false;
  }

  async close(): Promise<void> {
    if (!this.activePopup || this.isAnimating) return;

    this.isAnimating = true;

    this.hideBackdrop();
    await this.hidePopup(this.activePopup);
    this.unlockBody();

    this.isAnimating = false;
  }

  private showBackdrop(): void {
    this.backdrop.classList.add('is-open');
    this.backdrop.addEventListener('pointerdown', this.onBackdropPress);
    this.backdrop.addEventListener('click', this.onCloseClick);
    document.addEventListener('keydown', this.onEscPress);
  }

  private hideBackdrop(): void {
    this.backdrop.classList.remove('is-open');
    this.backdrop.removeEventListener('pointerdown', this.onBackdropPress);
    this.backdrop.removeEventListener('click', this.onCloseClick);
    document.removeEventListener('keydown', this.onEscPress);
  }

  private async showPopup(popup: HTMLElement): Promise<void> {
    popup.classList.add('is-active');
    this.backdrop.scrollTop = 0;
    popup.getBoundingClientRect();
    popup.classList.add('is-open');
    this.activePopup = popup;

    await wait(ANIMATION_DURATION);
  }

  private async hidePopup(popup: HTMLElement): Promise<void> {
    popup.classList.remove('is-open');

    await wait(ANIMATION_DURATION);

    popup.classList.remove('is-active');
    this.activePopup = null;
  }

  private lockBody(): void {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add('locked');
  }

  private unlockBody(): void {
    document.body.style.paddingRight = '';
    document.body.classList.remove('locked');
  }

  private onOpenClick = (event: MouseEvent): void => {
    const button = (event.target as Element).closest<HTMLElement>(
      '[data-popup-open]'
    );

    if (!button?.dataset.popupOpen) return;

    event.preventDefault();
    this.open(button.dataset.popupOpen);
  };

  private onBackdropPress = (event: PointerEvent): void => {
    if (event.target === this.backdrop) this.close();
  };

  private onCloseClick = (event: MouseEvent): void => {
    const button = (event.target as Element).closest('[data-popup-close]');
    if (button && button !== this.backdrop) this.close();
  };

  private onEscPress = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close();
  };
}

declare global {
  interface Window {
    popup: PopupManager;
  }
}

const backdrop = document.querySelector<HTMLElement>('[data-popup-backdrop]');

export const popup = backdrop ? new PopupManager(backdrop) : null;

if (popup) {
  window.popup = popup;
}
