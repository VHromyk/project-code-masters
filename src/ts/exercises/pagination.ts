
function getPages(current: number, total: number): Array<number | null> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const sorted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter(p => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: Array<number | null> = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push(null);
    result.push(page);
  });
  return result;
}

function numberButton(page: number, isActive: boolean): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = isActive ? 'pagination__btn is-active' : 'pagination__btn';
  btn.dataset.page = String(page);
  btn.textContent = String(page);
  if (isActive) btn.setAttribute('aria-current', 'page');
  return btn;
}

export interface PaginationState {
  page: number;
  totalPages: number;
}

export function renderPagination(container: HTMLElement, { page, totalPages }: PaginationState): void {
  if (!totalPages || totalPages <= 1) {
    container.replaceChildren();
    return;
  }

  const numbers = document.createElement('div');
  numbers.className = 'pagination__numbers';
  for (const item of getPages(page, totalPages)) {
    if (item === null) {
      const dots = document.createElement('span');
      dots.className = 'pagination__dots';
      dots.textContent = '…';
      numbers.append(dots);
    } else {
      numbers.append(numberButton(item, item === page));
    }
  }

  container.replaceChildren(numbers);
}
