const refs = {
  filtersBlock: document.querySelector<HTMLElement>('.filters-block'),
  subheader: document.querySelector<HTMLElement>('.filters-block-subheader'),
  categoryInput: document.querySelector<HTMLInputElement>('.filters-block-category-input')
};

export function changeFiltersState() {
  const { filtersBlock } = refs;
  if (filtersBlock) {
    filtersBlock.dataset.state = 'exercises';
  }
};

export function updateCategoryName(name: string) {
  const { subheader, categoryInput } = refs;
  if (subheader) {
    subheader.textContent = name;
  }
  if (categoryInput) {
    categoryInput.value = name;
  }
}