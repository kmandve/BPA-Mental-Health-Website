const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
const sections = Array.from(document.querySelectorAll("main section[id], header[id]"));
const chips = Array.from(document.querySelectorAll(".chip"));
const resourceCards = Array.from(document.querySelectorAll(".resource-card"));
const accordionTriggers = Array.from(document.querySelectorAll(".accordion-trigger"));
const supportForm = document.getElementById("supportForm");
const formStatus = document.getElementById("formStatus");

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
  const offset = window.scrollY + 140;
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
    const isVisible =
      category === "all" || cardCategories.split(" ").includes(category);
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

if (supportForm) {
  const fields = Array.from(
    supportForm.querySelectorAll("input, select, textarea")
  );

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  supportForm.addEventListener("submit", (event) => {
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
      "Request received. A support coordinator will follow up within one business day.";
    supportForm.reset();
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
