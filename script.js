// ✏️ Customize everything here for your girlfriend
const CONFIG = {
  herName: "Sayidah Nafisah",
  heroLove: "Sayidah Nafisah ❤️",
  heroDate: "20 June",
  // Gallery loads every image listed in images/list.json (run ./update-images.sh after adding photos)
  finaleMessage:
    "On your special day and every day after, I just want you to know — I'm so lucky you're mine. Here's to you, to us, and to all the birthdays we'll celebrate together. I love you endlessly. 💕",
  signature: "Sincerely: Amirul Hakim",
  password: "2062004",
};

// --- Password gate ---
const passwordGate = document.getElementById("password-gate");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");
const UNLOCK_KEY = "birthday-unlocked";

function unlockSite() {
  sessionStorage.setItem(UNLOCK_KEY, "1");
  passwordGate.classList.add("hidden");
  document.body.classList.remove("locked");
}

if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
  unlockSite();
} else {
  document.body.classList.add("locked");
}

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (passwordInput.value === CONFIG.password) {
    passwordError.hidden = true;
    unlockSite();
    enableVideoSound();
  } else {
    passwordError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
    passwordForm.classList.add("shake");
    setTimeout(() => passwordForm.classList.remove("shake"), 500);
  }
});

// --- DOM setup ---
document.getElementById("her-name").textContent = CONFIG.herName;
document.getElementById("hero-love").textContent = CONFIG.heroLove;
document.getElementById("hero-date").textContent = CONFIG.heroDate;
document.getElementById("finale-message").textContent = CONFIG.finaleMessage;
document.getElementById("signature").textContent = CONFIG.signature;

const momentGrid = document.getElementById("moment-grid");

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

function imageSrc(relativePath) {
  const parts = relativePath.split("/");
  const file = parts.pop();
  return `${parts.join("/")}/${encodeURIComponent(file)}`;
}

function captionFromSrc(src) {
  return decodeURIComponent(src.split("/").pop()).replace(/\.[^.]+$/, "");
}

function showPhotoPlaceholder(img) {
  const wrap = img.closest(".moment-photo");
  if (!wrap || wrap.querySelector(".photo-placeholder")) return;
  img.style.display = "none";
  const placeholder = document.createElement("div");
  placeholder.className = "photo-placeholder";
  placeholder.innerHTML = `
    <span>📷</span>
    <span>Add <strong>${img.dataset.filename || "photo"}</strong><br/>to the images folder</span>
  `;
  wrap.appendChild(placeholder);
}

function renderMoment(src, i) {
  const encodedSrc = imageSrc(src);
  const caption = captionFromSrc(src);
  const filename = src.split("/").pop();
  const frame = document.createElement("article");
  frame.className = "moment-frame";
  frame.style.transitionDelay = `${i * 0.08}s`;
  frame.innerHTML = `
    <div class="frame-tape" aria-hidden="true"></div>
    <div class="frame-body">
      <span class="frame-corner frame-corner--tl" aria-hidden="true"></span>
      <span class="frame-corner frame-corner--tr" aria-hidden="true"></span>
      <span class="frame-corner frame-corner--bl" aria-hidden="true"></span>
      <span class="frame-corner frame-corner--br" aria-hidden="true"></span>
      <div class="moment-photo">
        <img src="${encodedSrc}" alt="${caption}" data-filename="${filename}" loading="lazy" />
      </div>
      <div class="moment-caption">
        <h3>${caption}</h3>
      </div>
      <span class="frame-heart" aria-hidden="true">♥</span>
    </div>
  `;

  const img = frame.querySelector("img");
  img.addEventListener("error", () => showPhotoPlaceholder(img));

  frame.addEventListener("click", () => {
    if (img.style.display === "none") return;
    openLightbox(encodedSrc, caption);
  });

  momentGrid.appendChild(frame);
  scrollObserver.observe(frame);
}

async function loadGallery() {
  try {
    const res = await fetch("images/list.json");
    if (!res.ok) throw new Error("list.json not found");
    const moments = await res.json();
    moments.forEach(renderMoment);
  } catch {
    momentGrid.innerHTML = `<p style="text-align:center;color:var(--maroon-soft);grid-column:1/-1;">Add photos to the images folder, then run <strong>./update-images.sh</strong></p>`;
  }
}

loadGallery();

// --- Lightbox ---
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

// --- Birthday video ---
const birthdayVideo = document.getElementById("birthday-video");
const videoFrame = document.getElementById("video-frame");
let videoSoundEnabled = false;

function enableVideoSound() {
  if (videoSoundEnabled) return;
  videoSoundEnabled = true;
  birthdayVideo.muted = false;
}

function playVideoWithSound() {
  enableVideoSound();
  birthdayVideo.play().catch(() => {});
}

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoFrame.classList.add("visible");
        playVideoWithSound();
      }
    });
  },
  { threshold: 0.35 }
);
videoObserver.observe(videoFrame);

const heartsBg = document.querySelector(".hearts-bg");
const heartChars = ["❤️", "🤎", "💕", "✨", "🌹", "♥"];
for (let i = 0; i < 18; i++) {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = heartChars[i % heartChars.length];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${12 + Math.random() * 14}s`;
  heart.style.animationDelay = `${Math.random() * 10}s`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
  heartsBg.appendChild(heart);
}

// --- Confetti canvas ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const confettiColors = ["#8b1a3a", "#5c1228", "#a83252", "#c9a882", "#f5e8ec", "#ffffff"];

function spawnConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.y < canvas.height + 40);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

// --- Interactive hero ---
const hero = document.getElementById("hero");
const heroGate = document.getElementById("hero-gate");
const heroContent = document.getElementById("hero-content");
const scrollHint = document.getElementById("scroll-hint");
let heroRevealed = false;

function spawnClickHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "hero-click-heart";
  heart.textContent = ["❤️", "♥", "💕", "🤎"][Math.floor(Math.random() * 4)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 40}px`);
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}

document.getElementById("open-surprise").addEventListener("click", () => {
  if (heroRevealed) return;
  heroRevealed = true;

  enableVideoSound();
  spawnConfetti(140);
  heroGate.classList.add("gate-out");

  setTimeout(() => {
    heroGate.hidden = true;
    hero.classList.add("hero--revealed");
    heroContent.classList.remove("hero-inner--hidden");
    scrollHint.classList.remove("scroll-hint--hidden");
  }, 520);
});

hero.addEventListener("click", (e) => {
  if (!heroRevealed) return;
  if (e.target.closest("button")) return;
  spawnClickHeart(e.clientX, e.clientY);
  if (Math.random() > 0.6) spawnConfetti(12);
});

heroContent.addEventListener("mousemove", (e) => {
  if (!heroRevealed) return;
  const rect = hero.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
  heroContent.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -4}deg)`;
});

heroContent.addEventListener("mouseleave", () => {
  heroContent.style.transform = "";
});

// --- Interactions ---
document.getElementById("burst-hearts").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.add("pulse");
  setTimeout(() => btn.classList.remove("pulse"), 500);
  spawnConfetti(80);

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = ["❤️", "🤎", "♥", "💕"][i % 4];
    const angle = (Math.PI * 2 * i) / 24;
    const dist = 80 + Math.random() * 120;
    heart.style.left = `${cx}px`;
    heart.style.top = `${cy}px`;
    heart.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    heart.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }
});
