(() => {
  const items = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    observer.observe(item);
  });
})();
