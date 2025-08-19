 function toggleMenu() {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.menu-toggle');

  nav.classList.toggle('active');
  toggle.classList.toggle('active');

  // update aria-expanded for accessibility
  const expanded = toggle.classList.contains('active');
  toggle.setAttribute('aria-expanded', expanded);
}