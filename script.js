document.getElementById('year').textContent = new Date().getFullYear();

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
