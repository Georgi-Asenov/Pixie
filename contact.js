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


// Contact form validation + Formspree submit
(() => {
  const form       = document.getElementById("contactForm");
  const submitBtn  = document.getElementById("submitBtn");
  const formBody   = document.getElementById("formBody");
  const formSuccess = document.getElementById("formSuccess");
  const resetBtn   = document.getElementById("resetBtn");

  if (!form || !submitBtn) return;

  // ---- Validation helpers ----

  const rules = {
    firstName: { required: true, label: "First name" },
    lastName:  { required: true, label: "Last name" },
    email:     { required: true, label: "Email address", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    service:   { required: true, label: "Type of work" },
    message:   { required: true, label: "Message", minLength: 10 },
  };

  const getField = (name) => document.getElementById(name);
  const getError = (name) => document.getElementById(name + "Error");

  const setError = (name, msg) => {
    const input = getField(name);
    const error = getError(name);
    if (!input || !error) return;
    error.textContent = msg;
    if (msg) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-describedby", name + "Error");
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-describedby");
    }
  };

  const validateField = (name) => {
    const rule  = rules[name];
    const input = getField(name);
    if (!rule || !input) return true;

    const val = input.value.trim();

    if (rule.required && !val) {
      setError(name, `${rule.label} is required.`);
      return false;
    }

    if (rule.pattern && val && !rule.pattern.test(val)) {
      setError(name, `Please enter a valid ${rule.label.toLowerCase()}.`);
      return false;
    }

    if (rule.minLength && val.length < rule.minLength) {
      setError(name, `${rule.label} is too short — please add a bit more detail.`);
      return false;
    }

    setError(name, "");
    return true;
  };

  const validateAll = () =>
    Object.keys(rules).map(validateField).every(Boolean);

  // Live validation: clear errors once the user starts correcting
  Object.keys(rules).forEach((name) => {
    const input = getField(name);
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(name);
    });
    input.addEventListener("blur", () => validateField(name));
  });


  // ---- Submit → Formspree fetch ----

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      const first = form.querySelector(".field-input.is-invalid");
      if (first) first.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    submitBtn.querySelector(".submit-label").textContent = "Sending";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // Success — show the thank-you panel
        formBody.hidden = true;
        formSuccess.hidden = false;
      } else {
        // Formspree returned an error
        const data = await response.json().catch(() => ({}));
        const msg = (data.errors || []).map(e => e.message).join(", ")
          || "Something went wrong. Please try again or email us directly.";
        showSubmitError(msg);
      }
    } catch {
      showSubmitError("Could not send your message. Please check your connection and try again.");
    }
  });

  function showSubmitError(msg) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
    submitBtn.querySelector(".submit-label").textContent = "Send Message";

    let errEl = document.getElementById("submitError");
    if (!errEl) {
      errEl = document.createElement("p");
      errEl.id = "submitError";
      errEl.className = "submit-error";
      submitBtn.insertAdjacentElement("afterend", errEl);
    }
    errEl.textContent = msg;
  }


  // ---- Reset (send another message) ----

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();

      Object.keys(rules).forEach((name) => {
        const input = getField(name);
        if (input) input.classList.remove("is-invalid");
        setError(name, "");
      });

      const errEl = document.getElementById("submitError");
      if (errEl) errEl.remove();

      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
      submitBtn.querySelector(".submit-label").textContent = "Send Message";

      formSuccess.hidden = true;
      formBody.hidden = false;

      const heading = formBody.querySelector(".form-heading");
      if (heading) heading.focus();
    });
  }
})();
