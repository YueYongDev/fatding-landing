document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature, .capabilities, .pet-section, .download, .stage').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

// Capability mockup modal
const modal = document.getElementById('capModal');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;

function openCap (key) {
  const tpl = document.getElementById('mock-' + key);
  if (!tpl) return;
  modalBody.innerHTML = '';
  modalBody.appendChild(tpl.content.cloneNode(true));
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lastFocus = document.activeElement;
  modal.querySelector('.modal-close').focus();
}

function closeCap () {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

document.querySelectorAll('.cap[data-cap]').forEach((card) => {
  const open = () => openCap(card.dataset.cap);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeCap();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeCap();
});
