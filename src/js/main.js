gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- LOADER ---
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");

gsap.to(loaderText, {
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
  onComplete: () => {
    gsap.to(loaderText, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      delay: 0.3,
      ease: "power2.in",
      onComplete: () => {
        loader.classList.add("hidden");
        initAnimations();
      },
    });
  },
});

// --- CUSTOM CURSOR ---
const cursor = document.getElementById("cursor");
if (cursor) {
  let cx = 0,
    cy = 0,
    tx = 0,
    ty = 0;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function updateCursor() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
      cursor.style.borderColor = "rgba(255,255,255,0.8)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.borderColor = "rgba(255,255,255,0.5)";
    });
  });
}

// --- MOBILE MENU ---
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.style.opacity = "1";
      mobileMenu.style.pointerEvents = "auto";
      menuToggle.textContent = "Close";
    } else {
      mobileMenu.style.opacity = "0";
      mobileMenu.style.pointerEvents = "none";
      menuToggle.textContent = "Menu";
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.style.opacity = "0";
      mobileMenu.style.pointerEvents = "none";
      menuToggle.textContent = "Menu";
    });
  });
}

// --- SMOOTH SCROLL NAV ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 0 },
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
  });
});

// --- MAIN ANIMATIONS ---
function initAnimations() {
  // Hero text
  gsap.from("#hero-name", {
    y: 120,
    opacity: 0,
    duration: 1.4,
    ease: "power4.out",
  });

  gsap.from("#hero-tagline", {
    y: 40,
    opacity: 0,
    duration: 1,
    delay: 0.4,
    ease: "power3.out",
  });

  gsap.from("#hero-stats", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.7,
    ease: "power3.out",
  });

  gsap.from("#scroll-indicator", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 1.2,
    ease: "power2.out",
  });

  // Scroll indicator pulse
  gsap.to(".scroll-line", {
    scaleY: 0.3,
    transformOrigin: "top",
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // Hero parallax
  gsap.to("#hero-bg", {
    y: 200,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  // Reveal up animations
  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Gallery items stagger
  gsap.utils.toArray(".gallery-item").forEach((item, i) => {
    gsap.from(item, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Parallax images
  gsap.utils.toArray("[data-speed]").forEach((el) => {
    const speed = parseFloat(el.dataset.speed);
    gsap.to(el.querySelector(".img-parallax"), {
      y: (1 - speed) * 200,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  // Marquee
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    gsap.to(marquee, {
      x: "-50%",
      ease: "none",
      duration: 20,
      repeat: -1,
    });
  }

  // Resume items
  gsap.utils.toArray(".resume-item").forEach((item) => {
    gsap.from(item, {
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Magnetic buttons
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}
