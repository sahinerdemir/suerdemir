gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

initAnimations();

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

  // --- GALLERY SLIDER ---
  const slider = document.getElementById("gallery-slider");
  if (slider) {
    const slides = slider.querySelectorAll(".gallery-slide");
    let isDragging = false, startX = 0, scrollLeft = 0;

    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => { isDragging = false; });
    slider.addEventListener("mouseup", () => { isDragging = false; });
    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    const scrollAmt = 400;
    document.getElementById("slider-prev").addEventListener("click", () => {
      slider.scrollBy({ left: -scrollAmt, behavior: "smooth" });
    });
    document.getElementById("slider-next").addEventListener("click", () => {
      slider.scrollBy({ left: scrollAmt, behavior: "smooth" });
    });

    // Slide reveal animation
    slides.forEach((s, i) => {
      gsap.from(s, {
        x: 80,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: slider,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    // --- LIGHTBOX ---
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbVideo = document.getElementById("lightbox-video");
    const lbCounter = document.getElementById("lightbox-counter");
    const lbZoom = document.getElementById("lightbox-zoom");

    const mediaItems = Array.from(slides).map(s => {
      if (s.dataset.type === "video") {
        return { type: "video", src: s.dataset.src };
      }
      return { type: "image", src: s.querySelector("img").src };
    });
    let currentIdx = 0;
    let zoomed = false;

    function showMedia() {
      const item = mediaItems[currentIdx];
      if (item.type === "video") {
        lbImg.classList.add("hidden");
        lbVideo.classList.remove("hidden");
        lbVideo.src = item.src;
        lbVideo.play();
        lbZoom.classList.add("hidden");
      } else {
        lbVideo.classList.add("hidden");
        lbVideo.pause();
        lbVideo.src = "";
        lbImg.classList.remove("hidden");
        lbImg.src = item.src;
        lbZoom.classList.remove("hidden");
      }
    }

    function openLightbox(idx) {
      currentIdx = idx;
      updateLightbox();
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }

    function closeLightbox() {
      lbVideo.pause();
      gsap.to(lightbox, {
        opacity: 0, duration: 0.25,
        onComplete: () => {
          lightbox.classList.add("hidden");
          document.body.style.overflow = "";
          lbVideo.src = "";
          resetZoom();
        }
      });
    }

    function updateLightbox() {
      showMedia();
      lbCounter.textContent = (currentIdx + 1) + " / " + mediaItems.length;
      resetZoom();
    }

    function resetZoom() {
      zoomed = false;
      lbImg.style.transform = "scale(1)";
      lbImg.style.cursor = "zoom-in";
      const zoomIcon = document.querySelector("#lightbox-zoom svg");
      if (zoomIcon) {
        zoomIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>';
      }
    }

    function toggleZoom() {
      if (mediaItems[currentIdx].type === "video") return;
      zoomed = !zoomed;
      lbImg.style.transform = zoomed ? "scale(2)" : "scale(1)";
      lbImg.style.cursor = zoomed ? "zoom-out" : "zoom-in";
      const zoomIcon = document.querySelector("#lightbox-zoom svg");
      if (zoomIcon) {
        zoomIcon.innerHTML = zoomed
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6"/>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>';
      }
    }

    slides.forEach((s) => {
      s.addEventListener("click", () => {
        if (isDragging) return;
        openLightbox(parseInt(s.dataset.index));
      });
    });

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-bg").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", () => {
      currentIdx = (currentIdx - 1 + mediaItems.length) % mediaItems.length;
      updateLightbox();
    });
    document.getElementById("lightbox-next").addEventListener("click", () => {
      currentIdx = (currentIdx + 1) % mediaItems.length;
      updateLightbox();
    });
    document.getElementById("lightbox-zoom").addEventListener("click", toggleZoom);
    lbImg.addEventListener("click", toggleZoom);

    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") { currentIdx = (currentIdx - 1 + mediaItems.length) % mediaItems.length; updateLightbox(); }
      if (e.key === "ArrowRight") { currentIdx = (currentIdx + 1) % mediaItems.length; updateLightbox(); }
    });
  }

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
