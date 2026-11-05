const scrollUpBtn = document.querySelector<HTMLButtonElement>('.scroll-up-btn');

if (scrollUpBtn) {
  const SHOW_AFTER_PX = 200;

  function canScroll(): boolean {
    return document.documentElement.scrollHeight > window.innerHeight + 1;
  }

  function updateVisibility(): void {
    const shouldShow = canScroll() && window.scrollY > SHOW_AFTER_PX;
    scrollUpBtn!.hidden = !shouldShow;
  }

  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  updateVisibility();
}
