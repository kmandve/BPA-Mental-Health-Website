const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
const sections = Array.from(document.querySelectorAll("main section[id], header[id]"));
const chips = Array.from(document.querySelectorAll(".chip"));
const resourceCards = Array.from(document.querySelectorAll(".resource-card"));
const accordionTriggers = Array.from(document.querySelectorAll(".accordion-trigger"));
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
const testimonialDots = Array.from(document.querySelectorAll(".dot"));
const appointmentForm = document.getElementById("appointmentForm");
const formStatus = document.getElementById("formStatus");
const appointmentDate = document.getElementById("appointmentDate");

if (appointmentDate) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  appointmentDate.setAttribute("min", `${yyyy}-${mm}-${dd}`);
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

function updateActiveLink() {
  const offset = window.scrollY + 150;
  let currentId = "";

  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const match = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", match);
  });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

function setChipState(targetChip) {
  chips.forEach((chip) => {
    const isTarget = chip === targetChip;
    chip.classList.toggle("active", isTarget);
    chip.setAttribute("aria-selected", String(isTarget));
  });
}

function filterResources(category) {
  resourceCards.forEach((card) => {
    const cardCategories = card.dataset.category || "";
    const isVisible = category === "all" || cardCategories.split(" ").includes(category);
    card.classList.toggle("is-hidden", !isVisible);
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const category = chip.dataset.filter || "all";
    setChipState(chip);
    filterResources(category);
  });
});

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const isOpen = item.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

function setTab(targetId) {
  tabButtons.forEach((button) => {
    const selected = button.dataset.tab === targetId;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === targetId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTab(button.dataset.tab);
  });
});

let activeTestimonial = 0;
let testimonialTimer;

function showTestimonial(index) {
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === index);
  });
  testimonialDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
  activeTestimonial = index;
}

function resetTestimonialTimer() {
  if (testimonialTimer) {
    window.clearInterval(testimonialTimer);
  }
  testimonialTimer = window.setInterval(() => {
    const nextIndex = (activeTestimonial + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
  }, 5000);
}

testimonialDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.index || 0);
    showTestimonial(index);
    resetTestimonialTimer();
  });
});

if (testimonialCards.length > 0) {
  showTestimonial(0);
  resetTestimonialTimer();
}

function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute("required");
  const isEmail = field.type === "email";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  let valid = true;

  if (isRequired && !value) {
    valid = false;
  }

  if (isEmail && value && !emailValid) {
    valid = false;
  }

  field.classList.toggle("is-invalid", !valid);
  return valid;
}

if (appointmentForm) {
  const fields = Array.from(appointmentForm.querySelectorAll("input, select, textarea"));

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const valid = fields.map((field) => validateField(field)).every(Boolean);

    if (!valid) {
      formStatus.textContent = "Please complete the highlighted fields.";
      const firstInvalid = fields.find((field) => field.classList.contains("is-invalid"));
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    formStatus.textContent =
      "Appointment request submitted. A coordinator will follow up with confirmation.";
    appointmentForm.reset();
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
