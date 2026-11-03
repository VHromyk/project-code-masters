const ANIMATION_DURATION = 500;
const OPEN_CLASS = 'is-open';
const ACTIVE_CLASS = 'is-active';
const LOCKED_CLASS = 'locked';

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const forceReflow = (element: HTMLElement): void => {
  void element.offsetHeight;
};

export class PopupManager {
  private activePopup: HTMLElement | null = null;
  private isAnimating = false;

  constructor(private readonly backdrop: HTMLElement) {
    document.addEventListener('click', this.handleOpenClick);
  }

  async open(id: string): Promise<void> {
    const popup = this.findPopup(id);
    if (!popup || popup === this.activePopup || this.isAnimating) return;

    await this.animate(async () => {
      if (this.activePopup) {
        await this.hidePopup(this.activePopup);
      } else {
        this.lockBody();
        this.showBackdrop();
      }
      await this.showPopup(popup);
    });
  }

  async close(): Promise<void> {
    const popup = this.activePopup;
    if (!popup || this.isAnimating) return;

    await this.animate(async () => {
      this.hideBackdrop();
      await this.hidePopup(popup);
      this.unlockBody();
    });
  }

  private async animate(action: () => Promise<void>): Promise<void> {
    this.isAnimating = true;
    try {
      await action();
    } finally {
      this.isAnimating = false;
    }
  }

  private findPopup(id: string): HTMLElement | null {
    const popup = document.getElementById(id);
    return popup && this.backdrop.contains(popup) ? popup : null;
  }

  private async showPopup(popup: HTMLElement): Promise<void> {
    popup.classList.add(ACTIVE_CLASS);
    this.backdrop.scrollTop = 0;
    forceReflow(popup);
    popup.classList.add(OPEN_CLASS);
    this.activePopup = popup;
    await wait(ANIMATION_DURATION);
  }

  private async hidePopup(popup: HTMLElement): Promise<void> {
    popup.classList.remove(OPEN_CLASS);
    await wait(ANIMATION_DURATION);
    popup.classList.remove(ACTIVE_CLASS);
    this.activePopup = null;
  }

  private showBackdrop(): void {
    this.backdrop.classList.add(OPEN_CLASS);
    this.backdrop.addEventListener('pointerdown', this.handleBackdropPress);
    this.backdrop.addEventListener('click', this.handleCloseClick);
    document.addEventListener('keydown', this.handleKeydown);
  }

  private hideBackdrop(): void {
    this.backdrop.classList.remove(OPEN_CLASS);
    this.backdrop.removeEventListener('pointerdown', this.handleBackdropPress);
    this.backdrop.removeEventListener('click', this.handleCloseClick);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private lockBody(): void {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add(LOCKED_CLASS);
  }

  private unlockBody(): void {
    document.body.style.paddingRight = '';
    document.body.classList.remove(LOCKED_CLASS);
  }

  private readonly handleOpenClick = (event: MouseEvent): void => {
    const trigger = (event.target as Element).closest<HTMLElement>(
      '[data-popup-open]'
    );

    if (!trigger?.dataset.popupOpen) return;

    event.preventDefault();
    this.open(trigger.dataset.popupOpen);
  };

  private readonly handleBackdropPress = (event: PointerEvent): void => {
    if (event.target === this.backdrop) this.close();
  };

  private readonly handleCloseClick = (event: MouseEvent): void => {
    const trigger = (event.target as Element).closest('[data-popup-close]');
    if (trigger && trigger !== this.backdrop) this.close();
  };

  private readonly handleKeydown = (event: KeyboardEvent): void => {
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
