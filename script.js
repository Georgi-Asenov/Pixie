// Mobile nav toggle
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#navMenu");

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    setOpen(!isOpen);
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();


// Auto-split hero title into lines of N words (default 3)
(() => {
  const h1 = document.querySelector(".hero-title");
  if (!h1) return;

  const wordsPerLine = Math.max(1, parseInt(h1.getAttribute("data-brush-lines") || "3", 10));
  const text = h1.textContent.trim().replace(/\s+/g, " ");
  if (!text) return;

  const words = text.split(" ");
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  h1.innerHTML = lines
    .map(line => `<span class="brush-line">${line}</span>`)
    .join("<br>");
})();


// Footer year
(() => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();


// Reviews slider
(() => {
  const track    = document.getElementById("reviewsTrack");
  const prevBtn  = document.getElementById("sliderPrev");
  const nextBtn  = document.getElementById("sliderNext");
  const dotsWrap = document.getElementById("sliderDots");
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".review-slide"));
  const total  = slides.length;
  let current  = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Go to review ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".slider-dot"));

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  let touchStartX = 0;
  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });
})();



