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

// Set minimum date to today (in local timezone)
const dateInput = document.getElementById("date");
// Get today's date in local timezone, not UTC
function getLocalTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const today = getLocalTodayString();
dateInput.setAttribute("min", today);

// Proper form validation function
function validateForm() {
  let isValid = true;
  const requiredFields = appointmentForm.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    // Track individual field validity separately from overall form validity
    let fieldIsValid = true;

    // Remove previous error styling
    field.style.borderColor = "#e5e7eb";

    // Check if field is empty or has default empty value
    const value = field.value.trim();
    const isEmpty = value === "" || value === null || value === undefined;

    if (isEmpty) {
      field.style.borderColor = "#ef4444";
      fieldIsValid = false;
      isValid = false;
    } else {
      // Additional validation for specific field types
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          field.style.borderColor = "#ef4444";
          fieldIsValid = false;
          isValid = false;
        }
      }

      if (field.type === "date" && value) {
        // Compare dates in local timezone to avoid UTC timezone issues
        // Parse the selected date string (YYYY-MM-DD) in local timezone
        const selectedDateParts = value.split("-");
        const selectedDate = new Date(
          parseInt(selectedDateParts[0]),
          parseInt(selectedDateParts[1]) - 1,
          parseInt(selectedDateParts[2])
        );

        // Get today's date in local timezone
        const now = new Date();
        const todayDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        // Compare only the date portion (set time to midnight for both)
        selectedDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);

        if (selectedDate < todayDate) {
          field.style.borderColor = "#ef4444";
          fieldIsValid = false;
          isValid = false;
        }
      }

      // Apply green border based on individual field validity, not overall form validity
      if (fieldIsValid) {
        field.style.borderColor = "#10b981";
      }
    }
  });

  return isValid;
}

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate form before submission
  if (!validateForm()) {
    // Scroll to first invalid field
    const firstInvalid = appointmentForm.querySelector(
      "[style*='border-color: rgb(239, 68, 68)']"
    );
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }
    return;
  }

  // Get form data
  const formData = new FormData(appointmentForm);
  const data = Object.fromEntries(formData);

  // Here you would typically send this to a server
  console.log("Appointment data:", data);

  // Show success modal
  successModal.classList.add("active");

  // Reset form
  appointmentForm.reset();

  // Reset all field borders
  const allFields = appointmentForm.querySelectorAll("input, select, textarea");
  allFields.forEach((field) => {
    field.style.borderColor = "#e5e7eb";
  });

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

// Forum data structure
const forumData = {
  "General Discussion": {
    posts: [
      {
        author: "Alex M.",
        avatar: "A",
        title: "Welcome to our community!",
        content:
          "This is a safe space for everyone to share and support each other. Let's build a positive community together!",
        time: "2 hours ago",
        replies: 15,
      },
      {
        author: "Sarah K.",
        avatar: "S",
        title: "Daily check-in thread",
        content:
          "How is everyone doing today? Remember, it's okay to not be okay. We're here for you.",
        time: "5 hours ago",
        replies: 32,
      },
      {
        author: "Mike T.",
        avatar: "M",
        title: "Resources that helped me",
        content:
          "I wanted to share some resources that have been helpful in my journey. Happy to discuss more!",
        time: "1 day ago",
        replies: 28,
      },
    ],
  },
  "Anxiety Support": {
    posts: [
      {
        author: "Emma L.",
        avatar: "E",
        title: "Coping with panic attacks",
        content:
          "I've been using breathing techniques that really help. Would love to share what works for me.",
        time: "3 hours ago",
        replies: 24,
      },
      {
        author: "David R.",
        avatar: "D",
        title: "Anxiety and work stress",
        content:
          "How do you all manage anxiety in high-pressure work situations? Looking for practical tips.",
        time: "6 hours ago",
        replies: 18,
      },
      {
        author: "Lisa P.",
        avatar: "L",
        title: "Meditation app recommendations",
        content:
          "I've tried several meditation apps and found some really helpful ones. Happy to share my experience!",
        time: "2 days ago",
        replies: 41,
      },
    ],
  },
  "Depression Support": {
    posts: [
      {
        author: "Chris B.",
        avatar: "C",
        title: "Small wins matter",
        content:
          "Today I got out of bed and went for a walk. It might seem small, but it's progress. Remember your small wins!",
        time: "1 hour ago",
        replies: 19,
      },
      {
        author: "Jessica W.",
        avatar: "J",
        title: "Therapy has been life-changing",
        content:
          "After months of hesitation, I finally started therapy. It's been the best decision I've made. You're not alone.",
        time: "4 hours ago",
        replies: 27,
      },
      {
        author: "Ryan H.",
        avatar: "R",
        title: "Building a support network",
        content:
          "How do you build a support network when you feel isolated? Would appreciate any advice.",
        time: "1 day ago",
        replies: 22,
      },
    ],
  },
  "Recovery Stories": {
    posts: [
      {
        author: "Maya S.",
        avatar: "M",
        title: "Two years in recovery",
        content:
          "Two years ago, I couldn't imagine being where I am today. Recovery is possible, and you're stronger than you know.",
        time: "5 hours ago",
        replies: 45,
      },
      {
        author: "Tom G.",
        avatar: "T",
        title: "What recovery looks like for me",
        content:
          "Recovery isn't linear, and that's okay. Here's my journey and what I've learned along the way.",
        time: "8 hours ago",
        replies: 33,
      },
      {
        author: "Anna F.",
        avatar: "A",
        title: "Finding hope again",
        content:
          "I want to share my story to give others hope. Things can and do get better.",
        time: "2 days ago",
        replies: 56,
      },
    ],
  },
  "Coping Strategies": {
    posts: [
      {
        author: "Sam D.",
        avatar: "S",
        title: "Grounding techniques that work",
        content:
          "I've compiled a list of grounding techniques that have helped me during difficult moments. Hope they help you too!",
        time: "2 hours ago",
        replies: 31,
      },
      {
        author: "Olivia C.",
        avatar: "O",
        title: "Journaling prompts",
        content:
          "I've been journaling daily and it's been transformative. Here are some prompts that might help you get started.",
        time: "7 hours ago",
        replies: 29,
      },
      {
        author: "James N.",
        avatar: "J",
        title: "Exercise and mental health",
        content:
          "Regular exercise has been a game-changer for my mental health. Would love to hear what works for others!",
        time: "1 day ago",
        replies: 38,
      },
    ],
  },
  "Questions & Advice": {
    posts: [
      {
        author: "Patricia K.",
        avatar: "P",
        title: "First therapy session - what to expect?",
        content:
          "I have my first therapy session next week and I'm nervous. What should I expect? Any advice?",
        time: "1 hour ago",
        replies: 17,
      },
      {
        author: "Brian L.",
        avatar: "B",
        title: "Medication questions",
        content:
          "I'm considering talking to my doctor about medication. Can anyone share their experience?",
        time: "4 hours ago",
        replies: 26,
      },
      {
        author: "Rachel M.",
        avatar: "R",
        title: "Supporting a friend",
        content:
          "My friend is struggling with mental health. How can I best support them without overstepping?",
        time: "1 day ago",
        replies: 34,
      },
    ],
  },
};

// Forum modal creation
function createForumModal(categoryName) {
  // Remove existing modal if any
  const existingModal = document.getElementById("forumModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "forumModal";
  modal.className = "modal active";
  // Optimize modal rendering
  modal.style.willChange = "opacity, transform";
  modal.innerHTML = `
    <div class="modal-content forum-modal-content">
      <span class="close-modal">&times;</span>
      <h2>${categoryName}</h2>
      <div class="forum-posts-list">
        ${
          forumData[categoryName]
            ? forumData[categoryName].posts
                .map(
                  (post, index) => `
          <div class="forum-post-card" data-post-index="${index}">
            <div class="forum-post-header">
              <div class="forum-post-avatar">${post.avatar}</div>
              <div class="forum-post-author">
                <strong>${post.author}</strong>
                <span class="forum-post-time">${post.time}</span>
              </div>
            </div>
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="forum-post-footer">
              <span class="forum-replies">💬 ${post.replies} replies</span>
              <button class="btn btn-secondary btn-sm view-discussion-btn" data-post-title="${post.title}" data-post-content="${post.content}" data-post-author="${post.author}" data-post-time="${post.time}">View Discussion</button>
            </div>
          </div>
        `
                )
                .join("")
            : "<p>No posts available in this category.</p>"
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // Close modal handlers
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = "auto";
    }
  });

  // Make "View Discussion" buttons functional
  modal.querySelectorAll(".view-discussion-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const postTitle = btn.getAttribute("data-post-title");
      const postContent = btn.getAttribute("data-post-content");
      const postAuthor = btn.getAttribute("data-post-author");
      const postTime = btn.getAttribute("data-post-time");

      // Close forum modal
      modal.remove();

      // Create discussion detail modal
      const discussionModal = document.createElement("div");
      discussionModal.className = "modal active";
      discussionModal.innerHTML = `
        <div class="modal-content forum-modal-content">
          <span class="close-modal">&times;</span>
          <div class="forum-post-header" style="margin-bottom: 2rem;">
            <div class="forum-post-avatar">${postAuthor.charAt(0)}</div>
            <div class="forum-post-author">
              <strong>${postAuthor}</strong>
              <span class="forum-post-time">${postTime}</span>
            </div>
          </div>
          <h2>${postTitle}</h2>
          <div class="forum-post-detail">
            <p>${postContent}</p>
            <div class="forum-replies-section">
              <h3>Community Replies</h3>
              <div class="reply-item">
                <div class="reply-avatar">S</div>
                <div class="reply-content">
                  <strong>Supportive Member</strong>
                  <p>Thank you for sharing this. Your experience really resonates with me, and I appreciate your openness. This community is here for you!</p>
                  <span class="reply-time">1 hour ago</span>
                </div>
              </div>
              <div class="reply-item">
                <div class="reply-avatar">H</div>
                <div class="reply-content">
                  <strong>Helpful Helper</strong>
                  <p>I've been through something similar. What helped me was [specific advice]. You're taking the right steps by reaching out.</p>
                  <span class="reply-time">2 hours ago</span>
                </div>
              </div>
              <div class="reply-item">
                <div class="reply-avatar">C</div>
                <div class="reply-content">
                  <strong>Community Member</strong>
                  <p>You're not alone in this. Many of us have faced similar challenges, and we're all here to support each other. Keep going!</p>
                  <span class="reply-time">3 hours ago</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid #e5e7eb;">
              <textarea placeholder="Add your reply..." style="width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 12px; font-family: inherit; resize: vertical; min-height: 100px; margin-bottom: 1rem;"></textarea>
              <button class="btn btn-primary" style="width: 100%;">Post Reply</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(discussionModal);

      discussionModal
        .querySelector(".close-modal")
        .addEventListener("click", () => {
          discussionModal.remove();
          document.body.style.overflow = "auto";
        });

      discussionModal.addEventListener("click", (e) => {
        if (e.target === discussionModal) {
          discussionModal.remove();
          document.body.style.overflow = "auto";
        }
      });

      // Make reply button functional
      const replyBtn = discussionModal.querySelector(".btn-primary");
      replyBtn.addEventListener("click", () => {
        const textarea = discussionModal.querySelector("textarea");
        if (textarea.value.trim()) {
          replyBtn.textContent = "Posted! ✓";
          replyBtn.style.background = "#10b981";
          setTimeout(() => {
            discussionModal.remove();
            document.body.style.overflow = "auto";
          }, 1500);
        }
      });
    });
  });
}

// Forum category cards click effect
document.querySelectorAll(".category-card").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    const categoryName = card.querySelector("h3").textContent;

    // Add visual feedback
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);

    // Open forum modal
    createForumModal(categoryName);
  });
});

// Post items click effect - show individual post
document.querySelectorAll(".post-item").forEach((post) => {
  post.style.cursor = "pointer";
  post.addEventListener("click", () => {
    const postTitle = post.querySelector("h4").textContent;
    const postContent = post.querySelector("p").textContent;

    // Add visual feedback
    post.style.transform = "translateX(5px)";
    setTimeout(() => {
      post.style.transform = "";
    }, 200);

    // Create post detail modal
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content forum-modal-content">
        <span class="close-modal">&times;</span>
        <h2>${postTitle}</h2>
        <div class="forum-post-detail">
          <p>${postContent}</p>
          <div class="forum-replies-section">
            <h3>Replies</h3>
            <div class="reply-item">
              <div class="reply-avatar">R</div>
              <div class="reply-content">
                <strong>Reply User</strong>
                <p>This is a helpful response to the post. Community support is important!</p>
                <span class="reply-time">1 hour ago</span>
              </div>
            </div>
            <div class="reply-item">
              <div class="reply-avatar">S</div>
              <div class="reply-content">
                <strong>Support User</strong>
                <p>I completely understand. You're not alone in this journey.</p>
                <span class="reply-time">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
      document.body.style.overflow = "auto";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = "auto";
      }
    });
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

// Blog card read more links - show blog post detail
document.querySelectorAll(".read-more").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const blogCard = link.closest(".blog-card");
    const blogTitle = blogCard.querySelector("h3").textContent;
    const blogDate = blogCard.querySelector(".blog-date").textContent;
    const blogExcerpt = blogCard.querySelector("p").textContent;

    // Create blog post detail modal
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content forum-modal-content">
        <span class="close-modal">&times;</span>
        <div class="blog-post-header">
          <span class="blog-date">${blogDate}</span>
          <h2>${blogTitle}</h2>
        </div>
        <div class="blog-post-content">
          <p>${blogExcerpt}</p>
          <p>This is a comprehensive article about mental health awareness and support. In a full implementation, this would contain the complete blog post content with detailed information, research findings, practical tips, and resources.</p>
          <p>Mental health is an essential part of overall well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life, from childhood and adolescence through adulthood.</p>
          <h3>Key Takeaways</h3>
          <ul>
            <li>Mental health is just as important as physical health</li>
            <li>Seeking help is a sign of strength, not weakness</li>
            <li>There are many effective treatments available</li>
            <li>Support from community and professionals can make a significant difference</li>
          </ul>
          <p>Remember, you are not alone in your journey. There are resources, support systems, and professionals ready to help you navigate challenges and work toward better mental health.</p>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="this.closest('.modal').remove(); document.body.style.overflow='auto';">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
      document.body.style.overflow = "auto";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = "auto";
      }
    });

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

// Form validation enhancement with proper select handling
const formInputs = document.querySelectorAll(
  ".appointment-form input, .appointment-form select, .appointment-form textarea"
);

formInputs.forEach((input) => {
  // Handle change events for select elements
  if (input.tagName === "SELECT") {
    input.addEventListener("change", () => {
      if (input.value && input.value !== "") {
        input.style.borderColor = "#10b981";
      } else if (input.hasAttribute("required")) {
        input.style.borderColor = "#ef4444";
      } else {
        input.style.borderColor = "#e5e7eb";
      }
    });
  }

  input.addEventListener("blur", () => {
    const value = input.value.trim();
    if (value !== "" && value !== null) {
      // Additional validation
      if (input.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          input.style.borderColor = "#10b981";
        } else {
          input.style.borderColor = "#ef4444";
        }
      } else {
        input.style.borderColor = "#10b981";
      }
    } else if (input.hasAttribute("required")) {
      input.style.borderColor = "#ef4444";
    } else {
      input.style.borderColor = "#e5e7eb";
    }
  });

  input.addEventListener("input", () => {
    const value = input.value.trim();
    if (value !== "" && value !== null) {
      input.style.borderColor = "#e5e7eb";
    } else {
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
