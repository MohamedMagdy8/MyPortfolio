// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIconFA = document.getElementById('themeIconFA');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeIconFA) {
    themeIconFA.className = theme === 'light' ? 'fa-solid fa-moon theme-icon-fa' : 'fa-solid fa-sun theme-icon-fa';
  }
}
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav?.classList.toggle('active');
  document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileNav?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== TIMELINE ANIMATION =====
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
timelineItems.forEach(item => timelineObserver.observe(item));

// ===== PARTICLES =====
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 92, 231, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }
  animate();
}

// ===== TYPING EFFECT =====
const typingEl = document.getElementById('typingText');
if (typingEl) {
  const roles = ['Full-Stack Developer', 'React Developer', 'Data Science Enthusiast', 'ML Explorer'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  function typeEffect() {
    const current = roles[roleIndex];
    typingEl.textContent = current.substring(0, charIndex);
    if (!isDeleting) {
      charIndex++;
      if (charIndex > current.length) { isDeleting = true; setTimeout(typeEffect, 1500); return; }
    } else {
      charIndex--;
      if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }
  typeEffect();
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  const origText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  
  const formData = new FormData(contactForm);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: json
  })
  .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #00cec9, #00b894)';
          setTimeout(() => { btn.innerHTML = origText; btn.style.background = ''; contactForm.reset(); }, 3000);
      } else {
          console.log(response);
          btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error Sending';
          btn.style.background = '#ea4335';
          setTimeout(() => { btn.innerHTML = origText; btn.style.background = ''; }, 3000);
      }
  })
  .catch(error => {
      console.log(error);
      btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error Sending';
      btn.style.background = '#ea4335';
      setTimeout(() => { btn.innerHTML = origText; btn.style.background = ''; }, 3000);
  });
});

// ===== SMOOTH SCROLL FOR ALL ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});
