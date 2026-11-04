/* Fundament. — gedeeld script voor alle pagina's (menu, animaties, testimonial-slider) */
(function () {
  'use strict';

  // ── Hamburger / mobiel menu ──────────────────────────────────────────────
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  // ── Fade-up bij scrollen (alleen desktop, zoals voorheen) ─────────────────
  var fades = document.querySelectorAll('.fade-up');
  if (fades.length) {
    if (window.matchMedia('(min-width: 901px)').matches && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      fades.forEach(function (el) { observer.observe(el); });
    } else {
      fades.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  // ── Testimonial-slider (alleen aanwezig op de homepage) ───────────────────
  var track = document.getElementById('testimonial-track');
  if (track) {
    var total   = track.querySelectorAll('.testimonial-slide').length;
    var current = 0;
    var counter = document.getElementById('t-counter');
    var dotsBox = document.getElementById('t-dots');
    function goTo(n) {
      current = n;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
      document.querySelectorAll('.testimonial-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }
    if (dotsBox) {
      for (var i = 0; i < total; i++) {
        (function (n) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'testimonial-dot' + (n === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Ga naar testimonial ' + (n + 1));
          dot.addEventListener('click', function () { goTo(n); });
          dotsBox.appendChild(dot);
        })(i);
      }
    }
    var prev = document.getElementById('t-prev');
    var next = document.getElementById('t-next');
    if (prev) prev.addEventListener('click', function () { goTo((current - 1 + total) % total); });
    if (next) next.addEventListener('click', function () { goTo((current + 1) % total); });
    setInterval(function () { goTo((current + 1) % total); }, 6000);
    if (counter) counter.textContent = '1 / ' + total;
  }
})();
