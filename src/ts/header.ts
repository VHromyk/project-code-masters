const currentPath = window.location.pathname.split('/').pop() || 'index.html';

function isHomePath(path: string) {
  return path === '' || path === 'index.html';
}

document.querySelectorAll<HTMLAnchorElement>('.header__nav-link, .mobile-menu__link').forEach(link => {
  const linkPath = link.getAttribute('href')?.split('/').pop() || '';
  const isCurrent = isHomePath(currentPath)
    ? isHomePath(linkPath) || linkPath === './index.html'
    : linkPath.includes(currentPath);

  if (isCurrent) {
    link.classList.add('is-active');
  }
});

const burger = document.querySelector<HTMLButtonElement>('.header__burger');
const mobileMenu = document.querySelector<HTMLElement>('.mobile-menu');
const closeBtn = document.querySelector<HTMLButtonElement>('.mobile-menu__close');

function openMenu() {
  mobileMenu?.classList.add('is-open');
  mobileMenu?.setAttribute('aria-hidden', 'false');
  burger?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu?.classList.remove('is-open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
