/* ============================================================
   TECHNOVA SUMMIT 2026 — main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Navbar: sombra/blur al hacer scroll ---------- */
  const navbar = document.querySelector(".nova-navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Revelado de elementos al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Countdown estilo telemetría ---------- */
  const countdownEl = document.querySelector("[data-countdown]");
  if (countdownEl) {
    const target = new Date(countdownEl.dataset.countdown).getTime();
    const fields = {
      days: countdownEl.querySelector("[data-cd-days]"),
      hours: countdownEl.querySelector("[data-cd-hours]"),
      minutes: countdownEl.querySelector("[data-cd-minutes]"),
      seconds: countdownEl.querySelector("[data-cd-seconds]"),
    };
    const pad = (n) => String(Math.max(n, 0)).padStart(2, "0");

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        Object.values(fields).forEach((el) => el && (el.textContent = "00"));
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (fields.days) fields.days.textContent = pad(d);
      if (fields.hours) fields.hours.textContent = pad(h);
      if (fields.minutes) fields.minutes.textContent = pad(m);
      if (fields.seconds) fields.seconds.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Filtro visual de ponentes (Agenda / Ponentes) ---------- */
  const filterButtons = document.querySelectorAll("[data-speaker-filter]");
  const speakerCards = document.querySelectorAll("[data-speaker-track]");
  if (filterButtons.length && speakerCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("change", () => {
        const value = btn.dataset.speakerFilter;
        speakerCards.forEach((card) => {
          const col = card.closest(".speaker-col") || card;
          const match = value === "all" || card.dataset.speakerTrack === value;
          col.style.display = match ? "" : "none";
          if (match) {
            card.classList.remove("reveal");
          }
        });
      });
    });
  }

  /* ---------- Modal de detalle de ponente: rellenar contenido ---------- */
  const speakerModalEl = document.getElementById("speakerModal");
  if (speakerModalEl) {
    speakerModalEl.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;
      const data = trigger.dataset;
      speakerModalEl.querySelector("[data-modal-name]").textContent = data.name || "";
      speakerModalEl.querySelector("[data-modal-role]").textContent = data.role || "";
      speakerModalEl.querySelector("[data-modal-bio]").textContent = data.bio || "";
      speakerModalEl.querySelector("[data-modal-tag]").textContent = data.tag || "";
      const initialsEl = speakerModalEl.querySelector("[data-modal-initials]");
      if (initialsEl) {
        initialsEl.textContent = data.initials || "";
        initialsEl.style.background = data.color || "#6C4CF2";
      }
      const linkedin = speakerModalEl.querySelector("[data-modal-linkedin]");
      if (linkedin && data.linkedin) linkedin.href = data.linkedin;
    });
  }

  /* ---------- Selector de plan en Entradas -> pre-carga en Inscripción ---------- */
  document.querySelectorAll("[data-plan-select]").forEach((btn) => {
    btn.addEventListener("click", () => {
      try {
        sessionStorage.setItem("technova_plan", btn.dataset.planSelect);
      } catch (e) { /* almacenamiento no disponible: se ignora */ }
    });
  });

  /* ---------- Formulario de inscripción: wizard multi-paso ---------- */
  const wizardForm = document.getElementById("registrationForm");
  if (wizardForm) {
    const steps = Array.from(wizardForm.querySelectorAll(".wizard-pane"));
    const stepIndicators = Array.from(document.querySelectorAll(".wizard-step"));
    let current = 0;

    const planFromEntradas = (() => {
      try { return sessionStorage.getItem("technova_plan"); } catch (e) { return null; }
    })();
    if (planFromEntradas) {
      const select = wizardForm.querySelector("#planSeleccionado");
      if (select) select.value = planFromEntradas;
    }

    function paintSteps() {
      steps.forEach((pane, i) => pane.classList.toggle("is-active", i === current));
      stepIndicators.forEach((ind, i) => {
        ind.classList.toggle("is-active", i === current);
        ind.classList.toggle("is-done", i < current);
      });
      wizardForm.querySelector("[data-wizard-prev]").disabled = current === 0;
      const nextBtn = wizardForm.querySelector("[data-wizard-next]");
      const submitBtn = wizardForm.querySelector("[data-wizard-submit]");
      if (current === steps.length - 1) {
        nextBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");
        buildSummary();
      } else {
        nextBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
      }
    }

    function validateCurrentStep() {
      const pane = steps[current];
      const inputs = pane.querySelectorAll("input, select, textarea");
      let valid = true;
      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          valid = false;
        }
      });
      pane.classList.add("was-validated");
      return valid;
    }

    function buildSummary() {
      const get = (id) => {
        const el = wizardForm.querySelector("#" + id);
        if (!el) return "";
        if (el.tagName === "SELECT") return el.options[el.selectedIndex]?.text || "";
        return el.value;
      };
      const summary = document.getElementById("summaryPanel");
      if (!summary) return;
      summary.innerHTML = `
        <dl class="row mb-0">
          <div class="col-6"><dt>Nombre</dt><dd>${get("nombreCompleto") || "—"}</dd></div>
          <div class="col-6"><dt>Correo</dt><dd>${get("correo") || "—"}</dd></div>
          <div class="col-6"><dt>Empresa</dt><dd>${get("empresa") || "—"}</dd></div>
          <div class="col-6"><dt>País</dt><dd>${get("pais") || "—"}</dd></div>
          <div class="col-6"><dt>Plan elegido</dt><dd>${get("planSeleccionado") || "—"}</dd></div>
          <div class="col-6"><dt>Modalidad</dt><dd>${get("modalidad") || "—"}</dd></div>
        </dl>`;
    }

    wizardForm.querySelector("[data-wizard-next]").addEventListener("click", () => {
      if (!validateCurrentStep()) return;
      current = Math.min(current + 1, steps.length - 1);
      paintSteps();
      window.scrollTo({ top: wizardForm.offsetTop - 110, behavior: "smooth" });
    });

    wizardForm.querySelector("[data-wizard-prev]").addEventListener("click", () => {
      current = Math.max(current - 1, 0);
      paintSteps();
    });

    wizardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;
      const modalEl = document.getElementById("confirmationModal");
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
      showToast("toastInscripcion");
    });

    paintSteps();
  }

  /* ---------- Formulario de contacto: validación + toast ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }
      contactForm.classList.add("was-validated");
      showToast("toastContacto");
      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }

  /* ---------- Newsletter (Inicio) ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!newsletterForm.checkValidity()) {
        newsletterForm.classList.add("was-validated");
        return;
      }
      const alertBox = document.getElementById("newsletterAlert");
      if (alertBox) {
        alertBox.classList.remove("d-none");
        alertBox.classList.add("show");
      }
      newsletterForm.reset();
      newsletterForm.classList.remove("was-validated");
    });
  }

  /* ---------- Helper genérico para mostrar toasts ---------- */
  function showToast(id) {
    const toastEl = document.getElementById(id);
    if (!toastEl) return;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
  }

  /* ---------- Tooltips de Bootstrap (si existieran) ---------- */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new bootstrap.Tooltip(el);
  });
})();
