/* ═══════════════════════════════════════════════════
   SCRIPT.JS — Carousel, Modal, Interactions
   ═══════════════════════════════════════════════════ */

/* ── Certificate Data ─────────────────────────────── */
const certData = [
  { img: 'certificates/Human Computer Interaction (In English) - NPTEL.jpg', name: 'Human Computer Interaction', org: 'NPTEL' },
  { img: 'certificates/Geodata Processing using Python - ISRO , IIRS (Dehradun).jpg', name: 'Geodata Processing Using Python', org: 'ISRO / IIRS (Dehradun)' },
  { img: 'certificates/TCS iON Career Edge - Young Professional.jpg', name: 'Career Edge – Young Professional', org: 'TCS iON' },
  { img: 'certificates/Build Generative AI Apps and Solutions with No-Code Tools - Infosys SpringBoard.jpg', name: 'Build Generative AI Apps', org: 'Infosys Springboard' },
  { img: 'certificates/Build Generative AI Apps and Solutions with No-Code Tools - Udemy.jpg', name: 'Build Generative AI Apps', org: 'Udemy' },
  { img: 'certificates/ChatGPT-4 Prompt Engineering ChatGPT Generative AI & LLM - Infosysy SpringBoard.jpg', name: 'ChatGPT-4 Prompt Engineering & LLM', org: 'Infosys Springboard' },
  { img: 'certificates/ChatGPT made easy - AI Essentials for Beginners - Udemy.jpg', name: 'ChatGPT Made Easy – AI Essentials', org: 'Udemy' },
  { img: 'certificates/Chatbot or Smart Assistant Development - nasscom.jpg', name: 'Chatbot / Smart Assistant Development', org: 'NASSCOM' },
  { img: 'certificates/Full Stack Development with MERN - nasscom.jpg', name: 'Full Stack Development with MERN', org: 'NASSCOM' },
  { img: 'certificates/Master Generative AI and Generative AI tools (ChatGPT & more) - udemy certificate.jpg', name: 'Master Generative AI Tools', org: 'Udemy' },
  { img: 'certificates/Computational Theory Language Principle & Finite Automata Theory - Infosys Springboard.jpg', name: 'Computational Theory & Automata', org: 'Infosys Springboard' },
  { img: 'certificates/Introduction on Generative AI – Artificial intelligence and Machine Learning Certificate.png', name: 'Intro to Generative AI & ML', org: 'NASSCOM' },
  { img: 'certificates/Computer Communications Specialization (University of Colorado System) - Coursera.jpg', name: 'Computer Communications Specialization', org: 'Coursera (Univ. of Colorado)' },
  { img: 'certificates/Digital Systems From Logic Gates to Processors (universitat Autonoma de Barcelona) - coursera.jpg', name: 'Digital Systems: Logic Gates to Processors', org: 'Coursera (UAB)' },
  { img: 'certificates/Fundamentals of Network Communication (university of colorado) - coursera.jpg', name: 'Fundamentals of Network Communication', org: 'Coursera (Univ. of Colorado)' },
  { img: 'certificates/HTML & CSS - nasscom.jpg', name: 'HTML & CSS', org: 'NASSCOM' },
  { img: 'certificates/IELTS Pro Reading , Writing , Speaking , Listening Udemy.jpg', name: 'IELTS Pro – Reading, Writing, Speaking, Listening', org: 'Udemy' },
  { img: 'certificates/Introduction to Docker and Kubernetes.jpg', name: 'Introduction to Docker & Kubernetes', org: 'NASSCOM' },
  { img: 'certificates/Introduction to Hardware and Operating Systems (IBM) - coursera.jpg', name: 'Intro to Hardware & Operating Systems', org: 'Coursera (IBM)' },
  { img: 'certificates/Machine Learning and Image Processing - nasscom.jpg', name: 'Machine Learning & Image Processing', org: 'NASSCOM' },
  { img: 'certificates/Packet Switching Networks and Algorithms (university of colorado) - coursera.jpg', name: 'Packet Switching Networks & Algorithms', org: 'Coursera (Univ. of Colorado)' },
  { img: 'certificates/The Bits and Bytes of Computer Networking (Google) - coursera.jpg', name: 'Bits & Bytes of Computer Networking', org: 'Coursera (Google)' },
  { img: 'certificates/TCP,IP and Advanced Topics (University of colarado) - coursera.jpg', name: 'TCP/IP and Advanced Topics', org: 'Coursera (Univ. of Colorado)' },
  { img: 'certificates/automata badge.png', name: 'Automata Theory Badge', org: 'Infosys Springboard' },
  // { img: 'certificates/mongo db skill-a-thon certificates 2025-images-0.jpg', name: 'MongoDB Skill-a-thon 2025', org: 'MongoDB' },
  { img: 'certificates/python_basic certificate - HackerRank.jpg', name: 'Python Basic Certificate', org: 'HackerRank' },
  { img: 'certificates/summer training certificate 2025 - LPU-images-0.jpg', name: 'Summer Training 2025', org: 'LPU' },
];


/* ═══════════════════════════════════════════════════
   CAROUSEL LOGIC
   ═══════════════════════════════════════════════════ */
let currentIndex = 0;
const VISIBLE_IN_CAROUSEL = 5; // center + 2 sides + 2 far-sides
let carouselInterval;
const SLIDE_DELAY = 3000; // 3 second as requested

function initCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  // Create slide elements
  certData.forEach((cert, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.index = i;
    slide.innerHTML = `<img src="${cert.img}" alt="${cert.name}" loading="lazy" />`;
    slide.addEventListener('click', () => openCertModal(cert.img));
    track.appendChild(slide);
  });

  // Create dots
  const dotsContainer = document.getElementById('carousel-dots');
  certData.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  // Arrow listeners
  document.getElementById('carousel-prev').addEventListener('click', () => goToSlide(currentIndex - 1));
  document.getElementById('carousel-next').addEventListener('click', () => goToSlide(currentIndex + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('cert-modal').classList.contains('open')) return;
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  // Auto-slide
  startAutoSlide();

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', () => {
    if (!document.getElementById('cert-modal').classList.contains('open')) {
      startAutoSlide();
    }
  });

  updateCarousel();
}

function startAutoSlide() {
  if (document.getElementById('cert-modal')?.classList.contains('open')) return;
  stopAutoSlide();
  carouselInterval = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, SLIDE_DELAY);
}

function stopAutoSlide() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function goToSlide(index) {
  const total = certData.length;
  currentIndex = ((index % total) + total) % total; // wrap around
  updateCarousel();
  // Reset auto-slide timer if manual interaction occurred & modal is closed
  const modal = document.getElementById('cert-modal');
  if (modal && !modal.classList.contains('open')) {
    startAutoSlide();
  }
}

function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const total = certData.length;

  slides.forEach((slide) => {
    slide.className = 'carousel-slide'; // reset
  });

  // Assign positions
  const positions = [
    { offset: -2, cls: 'slide-far-left' },
    { offset: -1, cls: 'slide-left' },
    { offset: 0, cls: 'slide-center' },
    { offset: 1, cls: 'slide-right' },
    { offset: 2, cls: 'slide-far-right' },
  ];

  positions.forEach(({ offset, cls }) => {
    const idx = ((currentIndex + offset) % total + total) % total;
    const slide = slides[idx];
    if (slide) slide.classList.add(cls);
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });

  // Update cert name/org
  const nameEl = document.getElementById('carousel-cert-name');
  const orgEl = document.getElementById('carousel-cert-org');
  if (nameEl) nameEl.textContent = certData[currentIndex].name;
  if (orgEl) orgEl.textContent = certData[currentIndex].org;
}


/* ═══════════════════════════════════════════════════
   SHOW ALL CERTIFICATES TOGGLE
   ═══════════════════════════════════════════════════ */
let allCertsShown = false;
let gridInitialised = false;

function initShowAllToggle() {
  const btn = document.getElementById('cert-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    allCertsShown = !allCertsShown;
    const grid = document.getElementById('cert-all-grid');
    const btnSpan = btn.querySelector('span');
    const btnIcon = btn.querySelector('[data-lucide]');

    if (allCertsShown) {
      if (!gridInitialised) {
        buildAllCertsGrid();
        gridInitialised = true;
      }
      grid.classList.remove('hidden');
      btnSpan.textContent = 'Hide Certificates';
      btnIcon.setAttribute('data-lucide', 'eye-off');
    } else {
      grid.classList.add('hidden');
      btnSpan.textContent = 'Show All Certificates';
      btnIcon.setAttribute('data-lucide', 'grid-3x3');
    }
    lucide.createIcons();
  });
}

function buildAllCertsGrid() {
  const inner = document.getElementById('cert-all-grid-inner');
  certData.forEach((cert) => {
    const card = document.createElement('div');
    card.className = 'cert-grid-card';
    card.innerHTML = `
      <img src="${cert.img}" alt="${cert.name}" loading="lazy" />
      <div class="cert-grid-card-info">
        <h4>${cert.name}</h4>
        <p>${cert.org}</p>
      </div>
    `;
    card.addEventListener('click', () => openCertModal(cert.img));
    inner.appendChild(card);
  });
}


/* ═══════════════════════════════════════════════════
   CERTIFICATE MODAL
   ═══════════════════════════════════════════════════ */
function openCertModal(imgPath) {
  const modal = document.getElementById('cert-modal');
  const body = modal.querySelector('.cert-modal-body');

  body.innerHTML = '';
  const img = document.createElement('img');
  img.src = imgPath;
  img.alt = 'Certificate';
  body.appendChild(img);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  stopAutoSlide(); // Pause when viewing closely
}

function closeCertModal() {
  const modal = document.getElementById('cert-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.querySelector('.cert-modal-body').innerHTML = '';
    startAutoSlide(); // Resume
  }, 350);
}

function initModal() {
  const modal = document.getElementById('cert-modal');
  const closeBtn = modal.querySelector('.cert-modal-close');

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCertModal();
  });
  closeBtn.addEventListener('click', closeCertModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeCertModal();
  });
}


/* ═══════════════════════════════════════════════════
   DOMContentLoaded — all init
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Lucide icons
  lucide.createIcons();

  // Scroll fade-in
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });
  fadeEls.forEach((el) => fadeObs.observe(el));

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;
  const toggleMenu = () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    menuToggle.classList.toggle('hamburger-open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  };
  menuToggle.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('.mobile-link').forEach((l) => l.addEventListener('click', () => { if (menuOpen) toggleMenu(); }));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 10, behavior: 'smooth' });
    });
  });

  // Active nav
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const highlightNav = () => {
    const pos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach((s) => {
      const id = s.getAttribute('id');
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        navLinks.forEach((l) => {
          const active = l.getAttribute('href') === `#${id}`;
          l.classList.toggle('text-peach', active);
          l.style.fontWeight = active ? '600' : '';
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // Contact form
  const form = document.getElementById('contact-form');
  const formOk = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.42 31.42"/></svg> Sending…';
      
      // Use EmailJS to send the form
      // service_id: 'service_5gsc6gq', template_id: 'template_xzl84zg'
      emailjs.sendForm('service_5gsc6gq', 'template_xzl84zg', form)
        .then(() => {
          btn.innerHTML = '✓ Sent!';
          formOk.classList.remove('hidden');
          formOk.textContent = "✓ Message sent successfully! I'll get back to you soon.";
          formOk.classList.replace('text-red-400', 'text-peach-light');
          form.reset();
          
          setTimeout(() => { 
            btn.disabled = false; 
            btn.innerHTML = orig; 
            if (window.lucide) { lucide.createIcons(); }
            formOk.classList.add('hidden');
          }, 4000);
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          btn.innerHTML = '✕ Failed';
          formOk.classList.remove('hidden');
          formOk.textContent = "✕ Oops! Something went wrong. Please try again later.";
          formOk.classList.replace('text-peach-light', 'text-red-400');
          
          setTimeout(() => { 
            btn.disabled = false; 
            btn.innerHTML = orig; 
            if (window.lucide) { lucide.createIcons(); }
          }, 3000);
        });
    });
  }

  // Certificate Carousel & Modal
  initCarousel();
  initShowAllToggle();
  initModal();

  // Back to Top functionality
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
