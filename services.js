// Mobile nav toggle
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const menu   = document.querySelector("#navMenu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
})();


// Footer year
(() => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();


// Scroll-in animation for service rows
(() => {
  const rows = document.querySelectorAll(".service-row");
  if (!rows.length) return;

  // If IntersectionObserver isn't supported just show everything
  if (!("IntersectionObserver" in window)) {
    rows.forEach(r => r.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.15 }
  );

  rows.forEach(row => observer.observe(row));
})();
