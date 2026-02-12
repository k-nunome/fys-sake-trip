/**
 * FYS Trip - Main JavaScript
 * Handles interactions, animations, and UI functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
  initNewsletterForm();
  initScrollAnimations();
  initReservationForm();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  const body = document.body;

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.contains('active');

    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.style.overflow = isOpen ? '' : 'hidden';

    // Update ARIA
    menuToggle.setAttribute('aria-expanded', !isOpen);
  });

  // Close menu when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Header Background on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const scrollThreshold = 50;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial check
  updateHeader();

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Newsletter Form Validation
 */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter__form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();

      if (!email) {
        showFormMessage(form, 'Please enter your email address.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      // Simulate API call
      setTimeout(() => {
        showFormMessage(form, 'Thank you for subscribing!', 'success');
        emailInput.value = '';

        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 1000);
    });
  });
}

/**
 * Email Validation Helper
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show Form Message
 */
function showFormMessage(form, message, type) {
  // Remove existing message
  const existingMessage = form.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageEl = document.createElement('p');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: ${type === 'error' ? '#dc3545' : '#28a745'};
  `;

  form.appendChild(messageEl);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const animatedElements = document.querySelectorAll(
    '.card, .region-card, .package-card, .feature, .section__header'
  );

  if (!animatedElements.length) return;

  // Add initial styles
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Dark Mode Toggle (if needed)
 */
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/**
 * Initialize Theme from localStorage
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

// Initialize theme on load
initTheme();

/**
 * Reservation Form Handling
 */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const successMessage = document.getElementById('formSuccess');

  if (!form || !successMessage) return;

  form.addEventListener('submit', function() {
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    // Show success message after a short delay (to allow form submission)
    setTimeout(() => {
      form.style.display = 'none';
      successMessage.style.display = 'block';
    }, 1000);
  });
}
