/**
 * CELEBRATION — Editorial Luxury Wedding Websites
 * Core Interactive Logic: Carousels, Scroll Reveal, Sticky Header, Accordion & Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTimelineCarousel();
  initReviewsCarousel();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobNav = document.getElementById('mobNav');
  if (!burgerBtn || !mobNav) return;

  const toggleMenu = () => {
    const isOpen = mobNav.classList.contains('open');
    if (isOpen) {
      mobNav.classList.remove('open');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      mobNav.classList.add('open');
      burgerBtn.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  burgerBtn.addEventListener('click', toggleMenu);

  // Close on link click
  const mobLinks = mobNav.querySelectorAll('.mob-link');
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobNav.classList.remove('open');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animation (.rv -> .on)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.rv');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('on'));
  }
}

/* --------------------------------------------------------------------------
   4. Animated Metric Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  let started = false;
  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.dataset.target || 0;
      const prefix = counter.dataset.prefix || '';
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(ease * target);

        counter.textContent = `${prefix}${currentVal}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const trustBar = document.getElementById('trust-bar');
    if (!trustBar) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        runCounters();
      }
    }, { threshold: 0.2 });

    observer.observe(trustBar);
  } else {
    runCounters();
  }
}

/* --------------------------------------------------------------------------
   5. Timeline Carousel (Mobile)
   -------------------------------------------------------------------------- */
function initTimelineCarousel() {
  const track = document.getElementById('tlTrack');
  const prevBtn = document.getElementById('tlPrev');
  const nextBtn = document.getElementById('tlNext');
  const dotsContainer = document.getElementById('tlDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = track.querySelectorAll('.tl-card');
  const dots = dotsContainer.querySelectorAll('.tl-dot');
  let currentIndex = 0;

  const updateTimeline = (index) => {
    // Only apply in mobile view (< 860px)
    if (window.innerWidth >= 860) {
      track.style.transform = 'none';
      return;
    }

    currentIndex = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('on', idx === currentIndex);
    });
  };

  prevBtn.addEventListener('click', () => updateTimeline(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateTimeline(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = +e.target.dataset.i;
      updateTimeline(idx);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) {
      track.style.transform = 'none';
    } else {
      updateTimeline(currentIndex);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Reviews Carousel
   -------------------------------------------------------------------------- */
function initReviewsCarousel() {
  const track = document.getElementById('revTrack');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  const dotsContainer = document.getElementById('revDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.c-slide');
  const dots = dotsContainer.querySelectorAll('.tl-dot');
  let currentIndex = 0;
  let autoplayTimer = null;

  const updateSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('on', idx === currentIndex);
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  prevBtn.addEventListener('click', () => {
    updateSlide(currentIndex - 1);
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    updateSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = +e.target.dataset.i;
      updateSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-btn');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
      }
    });
  });
}
