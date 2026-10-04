/* ============================================================
   Home page (index.html) — hero, featured, stats
   ============================================================ */

var currentSlide = 0;
var hasAnimated = false;

/* Load 4 featured products on home */
fetchProducts()
  .then(function (data) {
    allProducts = data;
    var featured = allProducts.slice(0, 4);
    renderProducts(featured, 'featuredGrid');
    setupAddToCartDelegation('featuredGrid');
  })
  .catch(function (err) {
    console.error(err);
    showFetchError('featuredGrid');
  });

/* Hero slideshow */
var slides = document.querySelectorAll('.slide');
var dots = document.querySelectorAll('.dot');

if (slides.length > 0) {
  function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = n;

    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(index);
    });
  });

  setInterval(function () {
    showSlide((currentSlide + 1) % slides.length);
  }, 3500);
}

/* Stats counter */
var statsSection = document.getElementById('stats');

if (statsSection) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(statsSection);
}

function animateCounters() {
  var counters = document.querySelectorAll('.count-up');

  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var current = 0;
    var step = Math.ceil(target / 60);

    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  });
}
// ========== Testimonials Slider ==========
(function () {
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('#testimonialsDots .slide-dot');

  if (!track || !dots.length) return;

  const cards        = Array.from(track.querySelectorAll('.testimonial-card'));
  const total        = cards.length;        // 5 reviews
  let   current      = 0;                   // active index
  let   autoTimer    = null;
  const AUTO_DELAY   = 4000;                // 4 sec auto-slide

  // --- How many cards visible at once? ---
  function visibleCount() {
    if (window.innerWidth <= 600)  return 1;
    if (window.innerWidth <= 992)  return 2;
    return 3;
  }

  // --- Move the track to a given index ---
  function goTo(index) {
    const visible  = visibleCount();
    const maxIndex = total - visible;       // can't go past last full set

    // Clamp so we never over-scroll
    if (index < 0)        index = 0;
    if (index > maxIndex) index = maxIndex;

    current = index;

    // Card width + gap
    const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
    const gap       = 24;
    const offset    = current * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  // --- Auto-play ---
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const visible  = visibleCount();
      const maxIndex = total - visible;
      const next     = current >= maxIndex ? 0 : current + 1;
      goTo(next);
    }, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // --- Dot click ---
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.slide));
      startAuto(); // reset timer on manual click
    });
  });

  // --- Touch / swipe support ---
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
    startAuto();
  }, { passive: true });

  // --- Recalculate on resize ---
  window.addEventListener('resize', () => goTo(current));

  // --- Kick off ---
  goTo(0);
  startAuto();
})();