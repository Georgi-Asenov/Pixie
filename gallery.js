// Mobile nav toggle (same behavior as your index)
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
    setOpen(!menu.classList.contains("is-open"));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Close when clicking a link (mobile)
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) setOpen(false);
  });
})();


// Gallery filter
(() => {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!buttons.length || !items.length) return;

  const setActive = (btn) => {
    buttons.forEach(b => b.classList.toggle("is-active", b === btn));
  };

  const applyFilter = (filter) => {
    items.forEach(item => {
      const match = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !match);
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setActive(btn);
      applyFilter(filter);
    });
  });
})();


// Lightbox (click image to open)
(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const items = document.querySelectorAll(".gallery-item img");
  if (!lightbox || !lightboxImg || !items.length) return;

  const open = (src, alt) => {
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Gallery image";
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  };

  items.forEach(img => {
    img.addEventListener("click", () => open(img.src, img.alt));
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
})();


// Footer year
(() => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();
