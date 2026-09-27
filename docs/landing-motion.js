(() => {
  'use strict';
  const act = document.querySelector('.journey');
  if (!act || !window.ScrollCraft) return;

  const engine = window.ScrollCraft.mount(document);
  const stage = act.querySelector('.journey-stage');
  const actors = Object.fromEntries([...act.querySelectorAll('[data-actor]')].map(el => [el.dataset.actor, el]));
  const chapter = act.querySelector('[data-current-chapter]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const mix = (a, b, p) => a + (b - a) * p;

  function render() {
    scheduled = false;
    if (reduce.matches) return;
    const rect = act.getBoundingClientRect();
    const scrollable = Math.max(1, act.offsetHeight - window.innerHeight);
    const p = clamp(engine.acts[0] ? engine.acts[0].p : -rect.top / scrollable);
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const master = actors.master;
    const journeyX = p < .62 ? mix(-width * .04, width * .68, smooth(p / .62)) : mix(width * .68, -width * .25, smooth((p - .62) / .38));
    const bob = Math.sin(p * Math.PI * 12) * Math.min(10, height * .012);
    master.style.transform = `translate3d(${journeyX}px, ${bob}px, 0) rotate(${Math.sin(p * Math.PI * 8) * 3}deg)`;
    master.style.opacity = String(1 - smooth((p - .92) / .08));

    const enter = (from, to, fade = .055) => smooth((p - from) / fade) * (1 - smooth((p - to) / fade));
    const set = (name, opacity, x, y, rotation = 0) => {
      const el = actors[name];
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(${x * width}px, ${y * height}px, 0) rotate(${rotation}deg)`;
    };

    set('bear', enter(.32, .59), Math.sin(p * 5) * .018, 0, -2);
    set('squirrel', enter(.18, .49), mix(-.1, .12, smooth((p - .18) / .31)), 0, Math.sin(p * 9) * 2);
    set('tanuki', enter(.64, .96), Math.sin(p * 6) * .014, 0, 1);
    set('bird', enter(.26, .69), mix(-.16, .18, smooth((p - .26) / .43)), Math.sin(p * Math.PI * 3) * .025, Math.sin(p * 7) * 4);
    set('hedgehog', enter(.57, .9), Math.sin(p * 7) * .012, 0, -1);

    const names = ['01','02','03','04','05','06'];
    chapter.textContent = names[Math.min(5, Math.floor(p * 6))];
  }

  function onScroll() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(render);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reduce.addEventListener?.('change', onScroll);
  render();
})();
