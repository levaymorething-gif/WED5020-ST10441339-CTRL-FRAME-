// ============================================
// CTRLFRAME - Advanced All-in-One Site Script
// ============================================

// 🧭 NAVIGATION TOGGLE
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// 🖼️ IMAGE SLIDESHOW / GALLERY
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? 'block' : 'none';
  });
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}
if (slides.length > 0) {
  showSlide(currentSlide);
  setInterval(nextSlide, 4000);
}

// ✨ SCROLL ANIMATIONS
const fadeEls = document.querySelectorAll('.fade-in');
function checkFadeIn() {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', checkFadeIn);
checkFadeIn();

// 📩 FORM VALIDATION
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');
    if (!name.value || !email.value || !message.value) {
      e.preventDefault();
      alert('Please fill out all fields.');
    } else if (!email.value.includes('@')) {
      e.preventDefault();
      alert('Please enter a valid email.');
    }
  });
}

// 🎥 PAGE LOAD TRANSITION
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// 🧠 THEME / MOOD SWITCHER
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme',
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
  });
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

// 🎨 INTERACTIVE CANVAS (AR CANVAS PAGE)
const canvas = document.querySelector('#paint-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#ff004c';
  let drawing = false;
  canvas.addEventListener('mousedown', () => drawing = true);
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  });
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// 🔁 SMOOTH PAGE TRANSITION
const links = document.querySelectorAll('a[href]');
links.forEach(link => {
  link.addEventListener('click', e => {
    if (link.href.includes('#')) return;
    e.preventDefault();
    document.body.classList.remove('loaded');
    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });
});



// ================================
// CTRLFRAME - Generative Art + Audio Visualizer
// ================================

// Generative Art Background (smooth evolving gradient + particles)

// Generative Art Background (soft calm palette: light blue, cream, white, black)
(function generativeArt(){
  const canvas = document.getElementById('gen-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let t = 0;
  const particles = [];
  for (let i=0;i<60;i++){
    particles.push({
      x:Math.random()*w,
      y:Math.random()*h,
      r:Math.random()*2+0.5,
      vx:(Math.random()-0.5)*0.2,
      vy:(Math.random()-0.5)*0.2,
      color: Math.random() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'
    });
  }
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  function draw(){
    t += 0.005;
    const g = ctx.createLinearGradient(0,0,w,h);
    // Light blue to cream gradient
    g.addColorStop(0, 'hsl(200, 80%, 90%)');
    g.addColorStop(1, 'hsl(45, 85%, 88%)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    for (let p of particles){
      p.x += p.vx + Math.sin(t + p.y*0.001)*0.3;
      p.y += p.vy + Math.cos(t + p.x*0.001)*0.3;
      if (p.x < -10) p.x = w+10;
      if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10;
      if (p.y > h+10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// Audio Visualizer using Web Audio API
(function audioVisualizer(){
  const audioCanvas = document.getElementById('audio-canvas');
  const fileInput = document.getElementById('audio-file-input');
  const micBtn = document.getElementById('audio-mic-btn');
  const playBtn = document.getElementById('audio-play-btn');
  if (!audioCanvas || (!fileInput && !micBtn)) return;
  const actx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = actx.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const ac = actx;
  let sourceNode = null;
  let audioBufferSource = null;
  const ctx = audioCanvas.getContext('2d');
  function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,audioCanvas.width,audioCanvas.height);
    const barWidth = (audioCanvas.width / bufferLength) * 1.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      const h = v * audioCanvas.height * 0.9;
      ctx.fillStyle = `hsl(${i / bufferLength * 360} 80% ${50 + v*20}%)`;
      ctx.fillRect(x, audioCanvas.height - h, barWidth, h);
      x += barWidth + 1;
    }
  }
  draw();
  // Handle file input
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const decoded = await actx.decodeAudioData(arrayBuffer);
    if (audioBufferSource) audioBufferSource.stop();
    audioBufferSource = actx.createBufferSource();
    audioBufferSource.buffer = decoded;
    audioBufferSource.connect(analyser);
    analyser.connect(actx.destination);
    audioBufferSource.start(0);
    playBtn.textContent = 'Playing';
    playBtn.disabled = true;
    // re-enable after duration
    setTimeout(()=>{ playBtn.textContent = 'Play'; playBtn.disabled = false; }, (decoded.duration*1000) + 500);
  });
  // Mic input
  micBtn.addEventListener('click', async () => {
    if (!navigator.mediaDevices) return alert('Microphone not supported.');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (sourceNode) sourceNode.disconnect();
    sourceNode = actx.createMediaStreamSource(stream);
    sourceNode.connect(analyser);
    analyser.connect(actx.destination);
  });
})();