/**
 * Jin Chang (晉昌國際) - Corporate JS Controller
 * Handles bilingual language switching, mobile drawer navigation, scroll reveals,
 * header scrolling transitions, and corporate form validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  initLanguage();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
  initSPA(); // Initialize Single Page Application routing transitions
});

/* ==========================================================================
   1. Bilingual Language Switching System
   ========================================================================== */
function initLanguage() {
  const btnEn = document.getElementById('btn-lang-en');
  const btnZh = document.getElementById('btn-lang-zh');
  
  if (!btnEn || !btnZh) return;

  // Retrieve saved language or default to browser preference (or 'zh' as primary default)
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.language || navigator.userLanguage;
  const initialLang = savedLang || (browserLang.toLowerCase().includes('en') ? 'en' : 'zh');

  // Set initial language
  setLanguage(initialLang);

  // Attach event listeners
  btnEn.addEventListener('click', () => setLanguage('en'));
  btnZh.addEventListener('click', () => setLanguage('zh'));
}

function setLanguage(lang) {
  // Set language attribute on html tag
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('lang', lang);

  // Update active button state
  const btnEn = document.getElementById('btn-lang-en');
  const btnZh = document.getElementById('btn-lang-zh');
  
  if (btnEn && btnZh) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
    } else {
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
    }
  }

  // Update form input placeholders dynamically
  updatePlaceholders(lang);
}

function updatePlaceholders(lang) {
  const companyInput = document.getElementById('company');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const placeholders = {
    zh: {
      company: '例如：晉昌開發集團',
      name: '例如：張經理',
      email: 'jinchangdevelopment@gmail.com',
      message: '請簡述資產類別、規模及合作意向...'
    },
    en: {
      company: 'e.g. Jin Chang Development Group',
      name: 'e.g. Director Lin',
      email: 'jinchangdevelopment@gmail.com',
      message: 'Please briefly describe the asset type, scale, and intent...'
    }
  };

  if (companyInput) companyInput.placeholder = placeholders[lang].company;
  if (nameInput) nameInput.placeholder = placeholders[lang].name;
  if (emailInput) emailInput.placeholder = placeholders[lang].email;
  if (messageInput) messageInput.placeholder = placeholders[lang].message;
}

/* ==========================================================================
   2. Header Scroll Transition
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    // Scroll header background transition
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* ==========================================================================
   3. Mobile Navigation Menu (Drawer)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  const toggleMenu = (open) => {
    const nextState = open !== undefined ? open : toggleBtn.getAttribute('aria-expanded') !== 'true';

    toggleBtn.setAttribute('aria-expanded', String(nextState));
    mobileMenu.setAttribute('aria-hidden', String(!nextState));
    
    if (nextState) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scroll
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  menuLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   4. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.scroll-reveal');
  
  if (elementsToReveal.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.08
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  
  elementsToReveal.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   5. Institutional Proposal Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input-styled[required]');
  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  // Input validation
  const validateField = (input) => {
    const group = input.parentElement;
    let isValid = true;

    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value.trim());
    } else {
      isValid = input.value.trim() !== '';
    }

    if (!isValid) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }

    return isValid;
  };

  // Bind input events
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        const group = input.parentElement;
        group.classList.remove('has-error');
      }
    });
  });

  // Submit form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) isFormValid = false;
    });

    if (isFormValid) {
      const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = currentLang === 'en' ? '<span>Processing...</span>' : '<span>傳送中...</span>';

      // TODO: 這裡要換成您部署的 Google Apps Script 網址
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-p9tzkcnVjhJv136s-pAKOiZ8yREIduA9whxC868A9QUJ7Ub9agnPqBFB4n2I07YY/exec';
      
      const formData = new FormData(form);

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).then(() => {
        successMsg.style.display = 'block';
        form.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset placeholders
        updatePlaceholders(currentLang);

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }).catch(error => {
        console.error('Error submitting form:', error);
        alert(currentLang === 'en' ? 'Submission failed, please try again.' : '傳送失敗，請稍後再試。');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    }
  });
}

/* ==========================================================================
   6. Single Page Application (SPA) Section Routing Switcher
   ========================================================================== */
function initSPA() {
  const sections = document.querySelectorAll('.hero-section, #about, #operations, #contact');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const logoLink = document.getElementById('logo-link');
  const ctaLinks = document.querySelectorAll('a[href^="#"]');

  const switchSection = (targetId) => {
    // Default to hero if empty or '#'
    const activeId = (targetId === '#' || targetId === '' || targetId === '#hero') ? 'hero' : targetId.replace('#', '');
    
    let sectionFound = false;
    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (id === activeId || (id === 'hero' && activeId === 'hero') || (section.classList.contains('hero-section') && activeId === 'hero')) {
        section.classList.add('active');
        sectionFound = true;
        
        // Instantly trigger scroll reveal inside active section
        const reveals = section.querySelectorAll('.scroll-reveal');
        reveals.forEach(el => {
          el.classList.add('reveal-active');
        });
      } else {
        section.classList.remove('active');
      }
    });

    // Update active nav state
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}` || (activeId === 'hero' && href === '#')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Helper to resolve route
  const getSectionFromPath = (path) => {
    return (path === '/' || path === '') ? '#hero' : '#' + path.replace(/^\//, '');
  };

  // Intercept nav links
  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Use history.pushState for Path Routing
        const newPath = (href === '#' || href === '#hero') ? '/' : '/' + href.replace('#', '');
        if (history.pushState) {
          history.pushState(null, null, newPath);
        }
        
        switchSection(href);
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    switchSection(getSectionFromPath(window.location.pathname));
  });

  // Initial load logic with sessionStorage check (404.html redirect hack)
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== location.href) {
    history.replaceState(null, null, redirect);
  }

  // Initial switch
  switchSection(getSectionFromPath(window.location.pathname));
}
