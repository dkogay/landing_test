document.addEventListener('DOMContentLoaded', () => {
// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
const observer = new IntersectionObserver(
(entries, obs) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('reveal--visible');
obs.unobserve(entry.target);
}
});
},
{
threshold: 0.15,
rootMargin: '0px 0px -40px 0px'
}
);
revealElements.forEach(el => observer.observe(el));
} else {
// Fallback
revealElements.forEach(el => el.classList.add('reveal--visible'));
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
const question = item.querySelector('.faq-question');
const answer = item.querySelector('.faq-answer');
const icon = item.querySelector('.faq-icon');
if (!question || !answer) return;

question.addEventListener('click', () => {
  const isOpen = item.classList.contains('is-open');

  // Close all others
  faqItems.forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('is-open');
      const otherQuestion = otherItem.querySelector('.faq-question');
      if (otherQuestion) {
        otherQuestion.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Toggle current
  item.classList.toggle('is-open', !isOpen);
  question.setAttribute('aria-expanded', String(!isOpen));

  // Optional: focus management or scrolling if needed
  if (!isOpen && answer) {
    const rect = answer.getBoundingClientRect();
    const isOutOfView = rect.bottom > window.innerHeight;
    if (isOutOfView) {
      answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
});

// CTA scroll behavior
const scrollButtons = document.querySelectorAll('[data-scroll-target]');

scrollButtons.forEach(button => {
button.addEventListener('click', event => {
event.preventDefault();
const targetSelector = button.getAttribute('data-scroll-target');
if (!targetSelector) return;
  const target = document.querySelector(targetSelector);
  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

const updateNavVisibility = () => {
if (!nav) return;
if (window.innerWidth > 768) {
nav.style.display = '';
} else {
nav.style.display = 'none';
}
};

if (navToggle && nav) {
updateNavVisibility();
navToggle.addEventListener('click', () => {
  if (nav.style.display === 'flex') {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'flex';
  }
});

window.addEventListener('resize', updateNavVisibility);

nav.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      nav.style.display = 'none';
    }
  });
});

}

// Registration form submit
const form = document.getElementById('registration-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
form.addEventListener('submit', async event => {
event.preventDefault();
statusEl.textContent = 'Отправляем заявку...';
statusEl.classList.remove('form-status--success', 'form-status--error');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    statusEl.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    statusEl.classList.add('form-status--success');
    form.reset();
  } catch (error) {
    statusEl.textContent =
      'Произошла ошибка при отправке. Попробуйте ещё раз позже.';
    statusEl.classList.add('form-status--error');
  }
});
}
});