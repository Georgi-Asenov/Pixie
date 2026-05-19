// Mobile nav toggle (same as your other pages)
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

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) setOpen(false);
  });
})();

// Footer year
(() => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();
