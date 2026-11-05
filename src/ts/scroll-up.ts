const scrollUpBtn = document.querySelector('.scroll-up-btn');

if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
