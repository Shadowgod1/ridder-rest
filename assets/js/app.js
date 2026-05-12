// Ridder Tourism — Main application JS

// ── Navbar scroll effect ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  const updateNavbar = () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(5, 46, 22, 0.97)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      navbar.style.padding = '0.5rem 0';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '1rem 0';
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

// ── Mobile menu ───────────────────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.add('hidden');
  });
});

// ── Parallax hero ─────────────────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.4;
    heroBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

// ── Gallery lightbox ──────────────────────────────────────────────────────
function openLightbox(el) {
  const img = el.querySelector('img');
  if (!img) return;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (lb && lbImg) {
    lbImg.src = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
    lbImg.alt = img.alt;
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Contact form ──────────────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const phone = form.phone?.value || '';
  const message = form.message?.value || '';

  // Build WhatsApp message
  const text = encodeURIComponent(
    `Здравствуйте! Меня зовут ${name}.\n${message}\nТелефон: ${phone}`
  );
  window.open(`https://wa.me/77777777777?text=${text}`, '_blank');

  form.reset();
  const success = document.getElementById('form-success');
  if (success) {
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 5000);
  }
}

// ── Base filter (bases.html) ──────────────────────────────────────────────
function initBaseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const baseCards  = document.querySelectorAll('.base-filterable');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-green-700', 'text-white');
        b.classList.add('bg-white', 'text-green-700', 'border', 'border-green-300');
      });
      btn.classList.remove('bg-white', 'text-green-700', 'border', 'border-green-300');
      btn.classList.add('bg-green-700', 'text-white');

      const filter = btn.dataset.filter;
      baseCards.forEach(card => {
        const price = card.dataset.price;
        const show = filter === 'all' || price === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        }
      });
    });
  });
}

// ── Base modals (bases.html) ──────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.add('hidden');
      this.classList.remove('flex');
      document.body.style.overflow = '';
    }
  });
});

// ── Smooth scroll for anchor links ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Intersection Observer: fade-in cards ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-card').forEach(card => observer.observe(card));

// ── Gallery carousel ──────────────────────────────────────────────────────
function initGalleryCarousel() {
  const track   = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsEl  = document.getElementById('gallery-dots');
  const counter = document.getElementById('gallery-counter');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  if (!slides.length) return;

  let currentPage = 0;

  function perView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function pageCount() {
    return Math.ceil(slides.length / perView());
  }

  function setSlideSizes() {
    const pv = perView();
    slides.forEach(s => { s.style.width = `calc(100% / ${pv})`; });
  }

  function goTo(page) {
    const pv = perView();
    const pages = pageCount();
    currentPage = Math.max(0, Math.min(page, pages - 1));
    const offset = currentPage * (100 / pv) * pv;
    track.style.transform = `translateX(-${currentPage * 100}%)`;

    // dots
    const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('button')) : [];
    dots.forEach((d, i) => {
      d.classList.toggle('bg-green-600', i === currentPage);
      d.classList.toggle('bg-gray-300',  i !== currentPage);
      d.style.transform = i === currentPage ? 'scale(1.3)' : 'scale(1)';
    });

    // counter
    const first = currentPage * pv + 1;
    const last  = Math.min(first + pv - 1, slides.length);
    if (counter) counter.textContent = `${first}–${last} / ${slides.length}`;

    prevBtn.disabled = currentPage === 0;
    prevBtn.style.opacity = currentPage === 0 ? '0.3' : '';
    nextBtn.disabled = currentPage >= pageCount() - 1;
    nextBtn.style.opacity = currentPage >= pageCount() - 1 ? '0.3' : '';
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < pageCount(); i++) {
      const btn = document.createElement('button');
      btn.className = 'w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none';
      btn.setAttribute('aria-label', `Страница ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function init() {
    setSlideSizes();
    buildDots();
    goTo(0);
  }

  prevBtn.addEventListener('click', () => goTo(currentPage - 1));
  nextBtn.addEventListener('click', () => goTo(currentPage + 1));

  // touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentPage + (diff > 0 ? 1 : -1));
  }, { passive: true });

  // keyboard
  document.addEventListener('keydown', e => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    if (e.key === 'ArrowLeft')  goTo(currentPage - 1);
    if (e.key === 'ArrowRight') goTo(currentPage + 1);
  });

  // resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const savedPage = Math.floor(currentPage * perView() / perView());
      setSlideSizes();
      buildDots();
      goTo(Math.min(currentPage, pageCount() - 1));
    }, 150);
  });

  init();
}

// ── Init on DOM ready ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initBaseFilters();
  initGalleryCarousel();
});
