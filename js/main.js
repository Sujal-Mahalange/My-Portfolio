/**
 * SUJAL SUDHAKAR MAHALANGE — PORTFOLIO JAVASCRIPT
 * Features:
 * - Live Indian Standard Time (IST) clock
 * - Role cycler with smooth animation
 * - Custom desktop cursor with lag interpolation (lerp)
 * - 3D card tilt & mouse glare effect
 * - Sticky navbar with scroll progress & active spy
 * - Theme switcher (Dark / Light) with localStorage persistence
 * - Click-to-copy email with toast notifications
 * - GSAP & ScrollTrigger reveal animations (with pure CSS / IntersectionObserver fallback)
 * - Mobile responsive drawer
 * - Interactive contact form handling with mailto fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or check URL parameter (useful for previews)
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  const savedTheme = themeParam || localStorage.getItem('sm-portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.removeAttribute('data-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = htmlRoot.getAttribute('data-theme') === 'light';
      if (isCurrentlyLight) {
        htmlRoot.removeAttribute('data-theme');
        localStorage.setItem('sm-portfolio-theme', 'dark');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        htmlRoot.setAttribute('data-theme', 'light');
        localStorage.setItem('sm-portfolio-theme', 'light');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. PAGE LOADER DISMISSAL
  // --------------------------------------------------------------------------
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    if (urlParams.has('noloader')) {
      pageLoader.classList.add('is-loaded');
    } else {
      // Hide loader shortly after content is ready (max 1.1s for crisp UX)
      window.addEventListener('load', () => {
        setTimeout(() => {
          pageLoader.classList.add('is-loaded');
        }, 700);
      });

      // Safety fallback if load event already fired
      setTimeout(() => {
        if (!pageLoader.classList.contains('is-loaded')) {
          pageLoader.classList.add('is-loaded');
        }
      }, 1400);
    }
  }

  // --------------------------------------------------------------------------
  // 3. LIVE IST CLOCK (CHHATRAPATI SAMBHAJINAGAR, MAHARASHTRA, INDIA)
  // --------------------------------------------------------------------------
  const liveClockElements = document.querySelectorAll('.live-ist-clock');
  
  function updateISTClock() {
    try {
      const now = new Date();
      // Format time in Asia/Kolkata (IST)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const istTimeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      
      liveClockElements.forEach(el => {
        el.textContent = `${istTimeStr} IST`;
      });
    } catch (e) {
      // Fallback
      const now = new Date();
      const fallbackStr = now.toLocaleTimeString();
      liveClockElements.forEach(el => {
        el.textContent = `${fallbackStr}`;
      });
    }
  }

  updateISTClock();
  setInterval(updateISTClock, 1000);

  // --------------------------------------------------------------------------
  // 4. ROLE CYCLER (HERO SECTION)
  // --------------------------------------------------------------------------
  const roleTextElement = document.getElementById('role-cycler-text');
  const roles = [
    'Android Developer',
    'Backend API Engineer',
    'Systems & SQL Builder',
    'IT Postgraduate Scholar'
  ];
  let currentRoleIdx = 0;

  if (roleTextElement) {
    setInterval(() => {
      // Animate out
      roleTextElement.style.opacity = '0';
      roleTextElement.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        roleTextElement.textContent = roles[currentRoleIdx];
        roleTextElement.style.transform = 'translateY(10px)';

        // Animate in
        setTimeout(() => {
          roleTextElement.style.opacity = '1';
          roleTextElement.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 5. STICKY NAVBAR, SCROLL PROGRESS & ACTIVE SECTION SPY
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Header shrink
    if (scrollY > 35) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }

    // Scroll progress bar
    if (progressBar && docHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Active navigation highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 6. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileDrawer || !mobileToggleBtn) return;
    const isOpen = forceClose ? true : mobileDrawer.classList.contains('is-open');

    if (isOpen) {
      mobileDrawer.classList.remove('is-open');
      mobileToggleBtn.classList.remove('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileDrawer.classList.add('is-open');
      mobileToggleBtn.classList.add('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // Close mobile drawer on Escape key or outside click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      toggleMobileMenu(true);
    }
  });

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMobileMenu(true);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. CUSTOM CURSOR (DESKTOP ONLY WITH SMOOTH LERP)
  // --------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const customCursorRoot = document.getElementById('custom-cursor');

  if (customCursorRoot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        customCursorRoot.style.opacity = '1';
        isMoving = true;
      }
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    window.addEventListener('mouseleave', () => {
      customCursorRoot.style.opacity = '0';
      isMoving = false;
    });

    window.addEventListener('mousedown', () => {
      customCursorRoot.classList.add('cursor-click');
    });

    window.addEventListener('mouseup', () => {
      customCursorRoot.classList.remove('cursor-click');
    });

    // Lerp loop for ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor ring on interactive hover
    const hoverTargets = document.querySelectorAll('a, button, .glass-card, .skill-chip, input, textarea, .channel-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        customCursorRoot.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', () => {
        customCursorRoot.classList.remove('cursor-active');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. 3D CARD TILT & SPECULAR GLARE EFFECT
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.glass-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtle rotation (max 4.5 degrees)
        const rotateX = -deltaY * 4.5;
        const rotateY = deltaX * 4.5;

        // Specular glare position
        const glareX = `${(x / rect.width) * 100}%`;
        const glareY = `${(y / rect.height) * 100}%`;

        card.style.setProperty('--glare-x', glareX);
        card.style.setProperty('--glare-y', glareY);
        card.style.setProperty('--glare-opacity', '1');
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--glare-opacity', '0');
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. CLICK-TO-COPY EMAIL WITH TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.js-copy-email');
  const toastContainer = document.getElementById('toast-container');
  const SUJAL_EMAIL = 'sujalmahalange04@gmail.com';

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 3200);
  }

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(SUJAL_EMAIL);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement('textarea');
          textArea.value = SUJAL_EMAIL;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast(`Email: ${SUJAL_EMAIL}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. CONTACT FORM HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim();
      const email = document.getElementById('sender-email')?.value.trim();
      const subject = document.getElementById('sender-subject')?.value.trim();
      const message = document.getElementById('sender-message')?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please fill out all required fields.';
          formStatus.style.color = 'var(--accent)';
        }
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (formStatus) {
          formStatus.textContent = 'Please provide a valid email address.';
          formStatus.style.color = 'var(--accent)';
        }
        return;
      }

      // Construct mailto fallback
      const mailtoSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:${SUJAL_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (formStatus) {
        formStatus.textContent = 'Opening your email client...';
        formStatus.style.color = 'var(--text-main)';
      }

      showToast('Opening default mail client...');
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Message drafted! Thank you.';
        }
      }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // 11. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 12. DYNAMIC FOOTER YEAR
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 13. GSAP & SCROLLTRIGGER REVEALS (WITH RESILIENT FALLBACK)
  // --------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.from('.hero-meta-bar', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.hero-title-line', {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.5')
    .from('.hero-role-wrapper, .hero-description', {
      y: 25,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-actions', {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-highlight-card', {
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.7');

    // Section Headers
    gsap.utils.toArray('.section-header-wrap').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // About Section Cards
    gsap.utils.toArray('.about-grid > div').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: index * 0.15,
        ease: 'power3.out'
      });
    });

    // Skills Cards
    gsap.from('.skill-category-card', {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: -30,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // Project Bento Cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });

    // Contact Cards
    gsap.from('.contact-info-card, .contact-form-card', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      stagger: 0.18,
      duration: 0.85,
      ease: 'power3.out'
    });

  } else {
    // Pure CSS / IntersectionObserver fallback if GSAP is unavailable
    const revealElements = document.querySelectorAll('.glass-card, .timeline-item, .section-header-wrap');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      observer.observe(el);
    });
  }
});

