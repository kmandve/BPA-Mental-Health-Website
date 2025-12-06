// Navigation functionality
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");

    // Update active nav link
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Smooth scroll and active nav link update
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Logo click to scroll to top
document.querySelector(".logo").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// AOS (Animate On Scroll) implementation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate");
    }
  });
}, observerOptions);

document.querySelectorAll("[data-aos]").forEach((el) => {
  observer.observe(el);
});

// Appointment form handling
const appointmentForm = document.getElementById("appointmentForm");
const successModal = document.getElementById("successModal");

// Set minimum date to today
const dateInput = document.getElementById("date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(appointmentForm);
  const data = Object.fromEntries(formData);

  // Here you would typically send this to a server
  console.log("Appointment data:", data);

  // Show success modal
  successModal.classList.add("active");

  // Reset form
  appointmentForm.reset();

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
});

// Close modal
function closeModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});

// Close modal with X button
document.querySelector(".close-modal").addEventListener("click", closeModal);

// Community tabs functionality
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.getAttribute("data-tab");

    // Remove active class from all buttons and contents
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked button and corresponding content
    button.classList.add("active");
    document.getElementById(targetTab).classList.add("active");
  });
});

// Testimonials slider
const testimonialCards = document.querySelectorAll(".testimonial-card");
const navDots = document.querySelectorAll(".nav-dot");
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.remove("active");
    if (i === index) {
      card.classList.add("active");
    }
  });

  navDots.forEach((dot, i) => {
    dot.classList.remove("active");
    if (i === index) {
      dot.classList.add("active");
    }
  });

  currentTestimonial = index;
}

navDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showTestimonial(index);
  });
});

// Auto-rotate testimonials
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
}, 5000);

// Forum category cards click effect
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    // Add visual feedback
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);

    // In a real application, this would navigate to the forum
    console.log("Navigate to forum category");
  });
});

// Chat room join buttons
document.querySelectorAll(".join-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const roomCard = btn.closest(".chat-room-card");
    const roomName = roomCard.querySelector("h3").textContent;

    // Add visual feedback
    btn.textContent = "Joining...";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = "Joined ✓";
      btn.style.background = "#10b981";

      // In a real application, this would open the chat room
      console.log(`Joining ${roomName}`);
    }, 1000);
  });
});

// Post items click effect
document.querySelectorAll(".post-item").forEach((post) => {
  post.addEventListener("click", () => {
    // Add visual feedback
    post.style.transform = "translateX(5px)";
    setTimeout(() => {
      post.style.transform = "";
    }, 200);

    // In a real application, this would open the post
    console.log("Opening post");
  });
});

// Blog card read more links
document.querySelectorAll(".read-more").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const blogCard = link.closest(".blog-card");
    const blogTitle = blogCard.querySelector("h3").textContent;

    // In a real application, this would navigate to the full blog post
    console.log(`Reading: ${blogTitle}`);

    // Add visual feedback
    link.style.transform = "translateX(10px)";
    setTimeout(() => {
      link.style.transform = "";
    }, 300);
  });
});

// Resource link click tracking
document.querySelectorAll(".resource-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const resourceCard = link.closest(".resource-card");
    const resourceName = resourceCard.querySelector("h3").textContent;
    console.log(`Accessing resource: ${resourceName}`);
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector(".hero-section");
  if (heroSection && scrolled < window.innerHeight) {
    const orbs = document.querySelectorAll(".gradient-orb");
    orbs.forEach((orb, index) => {
      const speed = 0.5 + index * 0.2;
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Add ripple effect to buttons
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add CSS for ripple effect
const style = document.createElement("style");
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Form validation enhancement
const formInputs = document.querySelectorAll(
  ".appointment-form input, .appointment-form select, .appointment-form textarea"
);

formInputs.forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() !== "") {
      input.style.borderColor = "#10b981";
    } else if (input.hasAttribute("required")) {
      input.style.borderColor = "#ef4444";
    }
  });

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.style.borderColor = "#e5e7eb";
    }
  });
});

// Add keyboard navigation for testimonials
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && currentTestimonial > 0) {
    showTestimonial(currentTestimonial - 1);
  } else if (
    e.key === "ArrowRight" &&
    currentTestimonial < testimonialCards.length - 1
  ) {
    showTestimonial(currentTestimonial + 1);
  }
});

// Performance optimization: Lazy load images (if any are added later)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

console.log("Mindful Journey website loaded successfully! 🧠✨");
